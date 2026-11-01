import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200, // last 200 actions
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;