"use client";

interface Sale {
  id: number;
  quantity: number;
  rate: number;
  total: number;
  date: string;
  item: { name: string; unit: string };
  buyer: { name: string };
}

export const generateInvoice = async (sale: Sale) => {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Om Sai Enterprises", 20, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Construction Materials", 20, 26);
  doc.text("INVOICE", pageWidth - 20, 18, { align: "right" });
  doc.text(`#INV-${String(sale.id).padStart(4, "0")}`, pageWidth - 20, 26, { align: "right" });

  // Invoice Details
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(sale.buyer.name, 20, 63);

  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - 70, 55);
  doc.setFont("helvetica", "normal");
  doc.text(new Date(sale.date).toLocaleDateString("en-IN"), pageWidth - 70, 63);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 72, pageWidth - 20, 72);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 76, pageWidth - 40, 10, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Item", 25, 83);
  doc.text("Qty", 100, 83);
  doc.text("Unit", 125, 83);
  doc.text("Rate (₹)", 150, 83);
  doc.text("Amount (₹)", 175, 83);

  // Table Row
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.text(sale.item.name, 25, 96);
  doc.text(String(sale.quantity), 100, 96);
  doc.text(sale.item.unit, 125, 96);
  doc.text(String(sale.rate), 150, 96);
  doc.text(sale.total.toLocaleString(), 175, 96);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 103, pageWidth - 20, 103);

  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text(`Total: ₹${sale.total.toLocaleString()}`, pageWidth - 20, 115, { align: "right" });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", pageWidth / 2, 140, { align: "center" });
  doc.text("Om Sai Enterprises — Construction Materials", pageWidth / 2, 147, { align: "center" });

  // Save
  doc.save(`Invoice-${String(sale.id).padStart(4, "0")}-${sale.buyer.name}.pdf`);
};