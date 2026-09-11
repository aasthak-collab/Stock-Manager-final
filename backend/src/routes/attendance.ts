import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Get all workers
router.get("/workers", async (req: Request, res: Response): Promise<void> => {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: { name: "asc" },
    });
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workers" });
  }
});

// Add new worker
router.post("/workers", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, dailyRate } = req.body;
    const worker = await prisma.worker.create({
      data: { name, phone, dailyRate: Number(dailyRate) },
    });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ error: "Failed to create worker" });
  }
});

// Mark attendance
router.post("/mark", async (req: Request, res: Response): Promise<void> => {
  try {
    const { workerId, date, status, note } = req.body;

    const existing = await prisma.attendance.findFirst({
      where: {
        workerId: Number(workerId),
        date: new Date(date),
      },
    });

    if (existing) {
      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status, note },
      });
      res.json(updated);
    } else {
      const attendance = await prisma.attendance.create({
        data: {
          workerId: Number(workerId),
          date: new Date(date),
          status,
          note,
        },
      });
      res.json(attendance);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

// Get attendance for a date
router.get("/date/:date", async (req: Request, res: Response): Promise<void> => {
  try {
    const date = new Date(req.params.date as string);
    const attendance = await prisma.attendance.findMany({
      where: { date },
      include: { worker: true },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// Calculate and pay monthly salary
router.post("/pay-salary", async (req: Request, res: Response): Promise<void> => {
  try {
    const { workerId, month, year } = req.body;

    const worker = await prisma.worker.findUnique({
      where: { id: Number(workerId) },
    });
    if (!worker) {
      res.status(404).json({ error: "Worker not found" });
      return;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await prisma.attendance.findMany({
      where: {
        workerId: Number(workerId),
        date: { gte: startDate, lte: endDate },
      },
    });

    const fullDays = records.filter((r) => r.status === "PRESENT").length;
    const halfDays = records.filter((r) => r.status === "HALF").length;
    const totalDays = fullDays + halfDays * 0.5;
    const salary = totalDays * worker.dailyRate;

    await prisma.ledgerEntry.create({
      data: {
        type: "DEBIT",
        amount: salary,
        description: `Salary: ${worker.name} for ${month}/${year} (${totalDays} days × ₹${worker.dailyRate})`,
        refType: "SALARY",
      },
    });

    res.json({ worker: worker.name, totalDays, salary });
  } catch (error) {
    res.status(500).json({ error: "Failed to process salary" });
  }
});

export default router;