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

  // Background header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Om Sai Enterprises", 15, 18);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Construction Materials Supplier", 15, 26);
  doc.text("GST: XXXXXXXXXXXX", 15, 33);

  // Invoice label
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 15, 18, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("No: INV-" + String(sale.id).padStart(4, "0"), pageWidth - 15, 26, { align: "right" });
  doc.text("Date: " + new Date(sale.date).toLocaleDateString("en-IN"), pageWidth - 15, 33, { align: "right" });

  // Bill To section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 15, 58);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(sale.buyer.name, 15, 66);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 74, pageWidth - 15, 74);

  // Table header background
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 78, pageWidth - 30, 10, "F");

  // Table headers
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("ITEM DESCRIPTION", 20, 85);
  doc.text("QTY", 110, 85);
  doc.text("UNIT", 130, 85);
  doc.text("RATE (Rs.)", 150, 85);
  doc.text("AMOUNT (Rs.)", 175, 85);

  // Table row
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(sale.item.name, 20, 98);
  doc.text(String(sale.quantity), 110, 98);
  doc.text(sale.item.unit, 130, 98);
  doc.text(String(sale.rate), 150, 98);
  doc.text(sale.total.toLocaleString(), 175, 98);

  // Row divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 105, pageWidth - 15, 105);

  // Total section
  doc.setFillColor(37, 99, 235);
  doc.rect(pageWidth - 80, 110, 65, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL: Rs." + sale.total.toLocaleString(), pageWidth - 17, 119, { align: "right" });

  // Amount in words
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("Amount is final and inclusive of all charges.", 15, 120);

  // Footer divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 260, pageWidth - 15, 260);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business with Om Sai Enterprises!", pageWidth / 2, 267, { align: "center" });
  doc.text("This is a computer generated invoice.", pageWidth / 2, 273, { align: "center" });

  // Signature line
  doc.setDrawColor(180, 180, 180);
  doc.line(pageWidth - 70, 250, pageWidth - 15, 250);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text("Authorized Signature", pageWidth - 42, 256, { align: "center" });

  doc.save("Invoice-INV-" + String(sale.id).padStart(4, "0") + "-" + sale.buyer.name + ".pdf");
};