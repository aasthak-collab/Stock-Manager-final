import { Router, Request, Response } from "express";
import prisma from "../prismaClient";

const router = Router();

// Get all suppliers with purchase history
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        purchases: {
          include: { item: true },
          orderBy: { date: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

// Update supplier contact info
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { phone, address } = req.body;
    const supplier = await prisma.supplier.update({
      where: { id },
      data: { phone, address },
    });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: "Failed to update supplier" });
  }
});

export default router;