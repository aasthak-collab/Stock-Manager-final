import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { logAudit } from "../auditLogger";

const router = Router();

// List purchases (the bill file itself is not sent, only whether one exists)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { item: true, supplier: true },
      orderBy: { date: "desc" },
    });
    res.json(purchases.map(({ billFile, ...rest }) => ({ ...rest, hasBill: !!billFile })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// Download one bill
router.get("/:id/bill", async (req: Request, res: Response): Promise<void> => {
  try {
    const p = await prisma.purchase.findUnique({ where: { id: parseInt(req.params.id as string) } });
    if (!p || !p.billFile) {
      res.status(404).json({ error: "No bill" });
      return;
    }
    res.json({ billFile: p.billFile, billName: p.billName });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bill" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, supplierName, quantity, rate, invoice, billFile, billName } = req.body;
    const total = quantity * rate;

    let supplier = await prisma.supplier.findFirst({ where: { name: supplierName } });
    if (!supplier) {
      supplier = await prisma.supplier.create({ data: { name: supplierName } });
    }

    const purchase = await prisma.purchase.create({
      data: { itemId, supplierId: supplier.id, quantity, rate, total, invoice, billFile, billName },
      include: { item: true, supplier: true },
    });

    await prisma.item.update({ where: { id: itemId }, data: { quantity: { increment: quantity } } });

    await prisma.stockTransaction.create({
      data: { itemId, type: "IN", quantity, note: `Purchase from ${supplierName}` },
    });

    await prisma.ledgerEntry.create({
      data: {
        type: "DEBIT",
        amount: total,
        description: `Purchase: ${purchase.item.name} from ${supplierName}`,
        refType: "PURCHASE",
        refId: purchase.id,
      },
    });

    await logAudit(
      "CREATE",
      "PURCHASE",
      `Purchased ${quantity} ${purchase.item.name} from ${supplierName} for ₹${total}`,
      req.headers["x-user-email"] as string
    );

    const { billFile: _omit, ...safe } = purchase;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

export default router;