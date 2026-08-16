import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Get all sales
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = await prisma.sale.findMany({
      include: { item: true, buyer: true },
      orderBy: { date: "desc" },
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// Add new sale
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, buyerName, quantity, rate } = req.body;
    const total = quantity * rate;

    // Check stock availability
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item || item.quantity < quantity) {
      res.status(400).json({ error: "Insufficient stock" });
      return;
    }

    // Create or find buyer
    let buyer = await prisma.buyer.findFirst({ where: { name: buyerName } });
    if (!buyer) {
      buyer = await prisma.buyer.create({ data: { name: buyerName } });
    }

    // Create sale
    const sale = await prisma.sale.create({
      data: { itemId, buyerId: buyer.id, quantity, rate, total },
      include: { item: true, buyer: true },
    });

    // Deduct stock
    await prisma.item.update({
      where: { id: itemId },
      data: { quantity: { decrement: quantity } },
    });

    // Add stock transaction
    await prisma.stockTransaction.create({
      data: {
        itemId,
        type: "OUT",
        quantity,
        note: `Sale to ${buyerName}`,
      },
    });

    // Add ledger entry
    await prisma.ledgerEntry.create({
      data: {
        type: "CREDIT",
        amount: total,
        description: `Sale: ${item.name} to ${buyerName}`,
        refType: "SALE",
        refId: sale.id,
      },
    });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sale" });
  }
});

export default router;