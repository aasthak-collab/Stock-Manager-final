import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

const router = Router();

// Get all users
router.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Add new staff user
router.post("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "staff" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Delete user
router.delete("/users/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Change password
router.post("/change-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password" });
  }
});
// Full data backup
router.get("/backup", async (req: Request, res: Response): Promise<void> => {
  try {
    const [items, purchases, sales, workers, attendance, ledger, suppliers] =
      await Promise.all([
        prisma.item.findMany(),
        prisma.purchase.findMany({ include: { item: true, supplier: true } }),
        prisma.sale.findMany({ include: { item: true, buyer: true } }),
        prisma.worker.findMany(),
        prisma.attendance.findMany({ include: { worker: true } }),
        prisma.ledgerEntry.findMany(),
        prisma.supplier.findMany(),
      ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      company: "Om Sai Enterprises",
      data: { items, purchases, sales, workers, attendance, ledger, suppliers },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=backup-${new Date().toISOString().split("T")[0]}.json`
    );
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: "Backup failed" });
  }
});
export default router;