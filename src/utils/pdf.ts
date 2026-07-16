import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
  invoice_no: string;
  invoice_date: string;
  due_date?: string;
  company_name: string;
  company_gstin: string;
  customer_name: string;
  customer_gstin: string;
  customer_address: string;
  customer_state: string;
  items: Array<{
    description: string;
    hsn: string;
    qty: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  gst_rate: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  total: number;
  doc_type: "tax_invoice" | "proforma";
}

export const generateInvoicePDF = (data: InvoiceData): string => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 15;

  // Header
  doc.setFontSize(14);
  doc.text(data.doc_type === "tax_invoice" ? "TAX INVOICE" : "PROFORMA INVOICE", pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  doc.setFontSize(10);
  doc.text(`Invoice No: ${data.invoice_no}`, 15, yPos);
  doc.text(`Date: ${new Date(data.invoice_date).toLocaleDateString("en-IN")}`, pageWidth - 50, yPos);
  yPos += 6;
  if (data.due_date) {
    doc.text(`Due Date: ${new Date(data.due_date).toLocaleDateString("en-IN")}`, pageWidth - 50, yPos);
    yPos += 6;
  }

  // Company & Customer Info
  yPos += 4;
  doc.setFontSize(9);
  doc.text("Bill From:", 15, yPos);
  doc.text("Bill To:", pageWidth / 2, yPos);
  yPos += 6;

  doc.setFontSize(8);
  doc.text(data.company_name, 15, yPos);
  doc.text(data.customer_name, pageWidth / 2, yPos);
  yPos += 4;
  doc.text(`GSTIN: ${data.company_gstin}`, 15, yPos);
  doc.text(`GSTIN: ${data.customer_gstin}`, pageWidth / 2, yPos);
  yPos += 4;
  doc.text(data.customer_address, pageWidth / 2, yPos, { maxWidth: 80 });
  yPos += 6;

  // Items Table
  yPos += 4;
  const tableData = data.items.map((item) => [
    item.description,
    item.hsn,
    item.qty.toString(),
    "₹" + item.rate.toFixed(2),
    "₹" + item.amount.toFixed(2),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Description", "HSN", "Qty", "Rate", "Amount"]],
    body: tableData,
    theme: "grid",
    margin: { left: 15, right: 15 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 8;

  // Totals
  doc.setFontSize(9);
  doc.text(`Subtotal:`, pageWidth - 50, yPos);
  doc.text(`₹${data.subtotal.toFixed(2)}`, pageWidth - 15, yPos, { align: "right" });
  yPos += 6;

  if (data.cgst !== undefined) {
    doc.text(`CGST (${data.gst_rate / 2}%):`, pageWidth - 50, yPos);
    doc.text(`₹${data.cgst.toFixed(2)}`, pageWidth - 15, yPos, { align: "right" });
    yPos += 5;
    doc.text(`SGST (${data.gst_rate / 2}%):`, pageWidth - 50, yPos);
    doc.text(`₹${data.sgst!.toFixed(2)}`, pageWidth - 15, yPos, { align: "right" });
    yPos += 5;
  } else if (data.igst !== undefined) {
    doc.text(`IGST (${data.gst_rate}%):`, pageWidth - 50, yPos);
    doc.text(`₹${data.igst.toFixed(2)}`, pageWidth - 15, yPos, { align: "right" });
    yPos += 5;
  }

  doc.setFontSize(10);
  doc.setFont("", "bold");
  doc.text(`Total:`, pageWidth - 50, yPos);
  doc.text(`₹${data.total.toFixed(2)}`, pageWidth - 15, yPos, { align: "right" });

  return doc.output("dataurlstring");
};

export interface ChallanData {
  challan_no: string;
  dispatch_date: string;
  order_no: string;
  customer_name: string;
  customer_address: string;
  vehicle_no?: string;
  driver_name?: string;
  items: Array<{
    description: string;
    qty: number;
  }>;
}

export const generateChallanPDF = (data: ChallanData): string => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 15;

  doc.setFontSize(14);
  doc.text("DELIVERY CHALLAN", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  doc.setFontSize(10);
  doc.text(`Challan No: ${data.challan_no}`, 15, yPos);
  doc.text(`Date: ${new Date(data.dispatch_date).toLocaleDateString("en-IN")}`, pageWidth - 50, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.text(`Order: ${data.order_no}`, 15, yPos);
  yPos += 6;
  doc.text(`Customer: ${data.customer_name}`, 15, yPos);
  yPos += 4;
  doc.text(data.customer_address, 15, yPos, { maxWidth: 100 });
  yPos += 10;

  if (data.vehicle_no) {
    doc.text(`Vehicle: ${data.vehicle_no}`, 15, yPos);
    yPos += 4;
  }
  if (data.driver_name) {
    doc.text(`Driver: ${data.driver_name}`, 15, yPos);
    yPos += 4;
  }

  yPos += 4;
  const tableData = data.items.map((item) => [item.description, item.qty.toString()]);

  autoTable(doc, {
    startY: yPos,
    head: [["Item Description", "Quantity"]],
    body: tableData,
    theme: "grid",
    margin: { left: 15, right: 15 },
    columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 30, halign: "center" } },
  });

  return doc.output("dataurlstring");
};
