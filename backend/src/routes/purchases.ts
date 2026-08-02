import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Get all purchases
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { item: true, supplier: true },
      orderBy: { date: "desc" },
    });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// Add new purchase
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, supplierName, quantity, rate, invoice } = req.body;
    const total = quantity * rate;

    // Create or find supplier
    let supplier = await prisma.supplier.findFirst({
      where: { name: supplierName },
    });
    if (!supplier) {
      supplier = await prisma.supplier.create({
        data: { name: supplierName },
      });
    }

    // Create purchase
    const purchase = await prisma.purchase.create({
      data: {
        itemId,
        supplierId: supplier.id,
        quantity,
        rate,
        total,
        invoice,
      },
      include: { item: true, supplier: true },
    });

    // Update stock
    await prisma.item.update({
      where: { id: itemId },
      data: { quantity: { increment: quantity } },
    });

    // Add stock transaction
    await prisma.stockTransaction.create({
      data: {
        itemId,
        type: "IN",
        quantity,
        note: `Purchase from ${supplierName}`,
      },
    });

    // Add ledger entry
    await prisma.ledgerEntry.create({
      data: {
        type: "DEBIT",
        amount: total,
        description: `Purchase: ${purchase.item.name} from ${supplierName}`,
        refType: "PURCHASE",
        refId: purchase.id,
      },
    });

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

export default router;