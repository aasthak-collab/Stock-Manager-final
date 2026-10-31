import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string; // must be set on Render

// Limit comes from the MAX_ADMINS environment variable (defaults to 4)
const MAX_ADMINS = Number(process.env.MAX_ADMINS) || 4;

// Register: open only until MAX_ADMINS exist, then only a logged-in admin can use it
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Count existing admins
    const adminCount = await prisma.user.count({ where: { role: "admin" } });

    // Once the limit is reached, require an admin token
    if (adminCount >= MAX_ADMINS) {
      const token = req.headers.authorization?.split(" ")[1];
      let decoded: any = null;
      try {
        decoded = token ? jwt.verify(token, JWT_SECRET) : null;
      } catch {
        decoded = null;
      }
      if (!decoded || decoded.role !== "admin") {
        res.status(403).json({ error: "Not allowed" });
        return;
      }
      // Block creating more admins past the limit
      if (role === "admin") {
        res.status(403).json({ error: `Maximum ${MAX_ADMINS} admins allowed` });
        return;
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "staff" },
    });

    res.json({ message: "User created", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to register" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// Get current user
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "No token" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;