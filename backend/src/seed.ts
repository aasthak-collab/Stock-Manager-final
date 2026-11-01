import prisma from "./prismaClient";

// [base name, variants]. Every variant becomes its own stock item.
const groups: [string, string[]][] = [
  // Pipes (27 items)
  ["Pipe 1x1", ["5.5kg", "7kg", "9kg"]],
  ["Pipe 1.5x1.5", ["8.5kg", "10kg", "14kg", "18kg"]],
  ["Pipe 2x2", ["10kg", "14kg", "18kg", "21kg"]],
  ["Pipe 3x3", ["26kg"]],
  ["Pipe 2x4", ["26kg"]],
  ["Pipe 3x1.5", ["18kg", "23kg"]],
  ["Pipe 3x1", ["10kg", "14kg", "18kg"]],
  ["Pipe 4x1", ["18kg"]],
  ["Pipe 48od", ["8.5kg", "14kg", "20kg"]],
  ["Pipe 42od", ["8kg"]],
  ["Pipe 2x1", ["8.5kg", "10kg", "14kg", "18kg"]],

  // Angles, channel, flats, bars (19 items)
  ["Angle", ["40x5", "50x5", "35x5", "32x3", "25x5", "25x3"]],
  ["Channel 3x1.5", ["Super Light"]],
  ["Flat", ["19x5", "25x5", "35x5", "40x5", "50x5", "25x3", "19x3"]],
  ["Sq", ["10mm", "8mm"]],
  ["Round", ["10mm", "12mm", "16mm"]],

  // Sheets (11 items)
  ["MS Sheet 3x6", ["20g", "18g"]],
  ["MS Sheet 3x8", ["20g"]],
  ["MS Sheet 4x8", ["20g", "18g"]],
  ["CC Sheet", ["8ft", "10ft", "12ft", "14ft", "16ft", "18ft"]],
];

async function main() {
  // Flatten into one list of full item names
  const data = groups.flatMap(([base, variants]) =>
    variants.map((v) => ({
      name: `${base} ${v}`,
      unit: "pcs",     // can be changed later on the Stock page
      quantity: 0,
      threshold: 10,
    }))
  );

  // skipDuplicates makes it safe to run more than once
  const result = await prisma.item.createMany({ data, skipDuplicates: true });
  console.log(`Added ${result.count} items (of ${data.length})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());