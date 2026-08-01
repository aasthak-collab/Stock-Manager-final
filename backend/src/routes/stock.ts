import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { name: "asc" },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, unit, quantity, threshold } = req.body;
    const item = await prisma.item.create({
      data: { name, unit, quantity, threshold },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create item" });
  }
});

router.post("/:id/add", async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity, note } = req.body;
    const id = parseInt(req.params.id as string);
    const item = await prisma.item.update({
      where: { id },
      data: { quantity: { increment: quantity } },
    });
    await prisma.stockTransaction.create({
      data: { itemId: id, type: "IN", quantity, note },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to add stock" });
  }
});

router.post("/:id/deduct", async (req: Request, res: Response): Promise<void> => {
  try {
    const { quantity, note } = req.body;
    const id = parseInt(req.params.id as string);
    const item = await prisma.item.update({
      where: { id },
      data: { quantity: { decrement: quantity } },
    });
    await prisma.stockTransaction.create({
      data: { itemId: id, type: "OUT", quantity, note },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to deduct stock" });
  }
});

router.get("/:id/transactions", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const transactions = await prisma.stockTransaction.findMany({
      where: { itemId: id },
      orderBy: { createdAt: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;