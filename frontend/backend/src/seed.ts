import prisma from "./prismaClient";

const items = [
  { name: "Flats/Patti", unit: "kg", quantity: 0, threshold: 10 },
  { name: "MS Angle", unit: "kg", quantity: 0, threshold: 10 },
  { name: "MS Channel", unit: "kg", quantity: 0, threshold: 10 },
  { name: "MS Pipe", unit: "kg", quantity: 0, threshold: 10 },
  { name: "MS Sheet", unit: "kg", quantity: 0, threshold: 10 },
  { name: "MS Wire Mesh", unit: "kg", quantity: 0, threshold: 10 },
  { name: "Profile/Roofing Sheet", unit: "kg", quantity: 0, threshold: 10 },
  { name: "Round Bar", unit: "kg", quantity: 0, threshold: 10 },
  { name: "SQ Bar", unit: "kg", quantity: 0, threshold: 10 },
];

async function main() {
  for (const item of items) {
    const existing = await prisma.item.findFirst({
      where: { name: item.name },
    });
    if (!existing) {
      await prisma.item.create({ data: item });
    }
  }
  console.log("Seeded all items!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());