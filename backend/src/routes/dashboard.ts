import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total items in stock
    const totalItems = await prisma.item.count();

    // Today's sales
    const todaysSales = await prisma.sale.findMany({
      where: { date: { gte: today, lt: tomorrow } },
    });
    const todaysSalesTotal = todaysSales.reduce((sum, s) => sum + s.total, 0);

    // Low stock items
    const allItems = await prisma.item.findMany();
    const lowStockCount = allItems.filter(
      (i) => i.quantity <= i.threshold
    ).length;

    // Total pending (all sales credit - all purchase debit = balance)
    const totalCredit = await prisma.ledgerEntry.aggregate({
      where: { type: "CREDIT" },
      _sum: { amount: true },
    });
    const totalDebit = await prisma.ledgerEntry.aggregate({
      where: { type: "DEBIT" },
      _sum: { amount: true },
    });
    const balance =
      (totalCredit._sum.amount || 0) - (totalDebit._sum.amount || 0);

    // Recent activity (last 5 ledger entries)
    const recentActivity = await prisma.ledgerEntry.findMany({
      orderBy: { date: "desc" },
      take: 5,
    });

    res.json({
      totalItems,
      todaysSalesTotal,
      todaysSalesCount: todaysSales.length,
      lowStockCount,
      balance,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;