import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Get all ledger entries
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const entries = await prisma.ledgerEntry.findMany({
      orderBy: { date: "desc" },
    });

    // Calculate running balance
    const totalCredit = entries
      .filter((e) => e.type === "CREDIT")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalDebit = entries
      .filter((e) => e.type === "DEBIT")
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = totalCredit - totalDebit;

    res.json({ entries, totalCredit, totalDebit, balance });
  } catch (error) {
    console.error("Ledger GET error:", error);   // ADD THIS LINE
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
});

// Add manual ledger entry
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, amount, description } = req.body;
    const entry = await prisma.ledgerEntry.create({
      data: { type, amount, description, refType: "MANUAL" },
    });
    res.json(entry);
  } catch (error) {
    console.error("Ledger POST error:", error);   // ADD THIS LINE
    res.status(500).json({ error: "Failed to create entry" });
  }
});

export default router;