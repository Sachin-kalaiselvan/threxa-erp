export default function Invoices() {
  return (
    <div>
      <h1 className="mb-5 text-lg font-semibold">Invoices</h1>
      <div className="card p-5 text-[13px] leading-relaxed text-[#B9BAC5]">
        Built in Phase 3: Proforma Invoice + GST Tax Invoice with automatic
        CGST/SGST split (IGST for interstate, based on the customer's state code),
        Delivery Challan, jsPDF generation, and share via WhatsApp (n8n webhook) / Email.
        The schema is already live — see the invoices table with doc_type,
        cgst_amount / sgst_amount / igst_amount columns.
      </div>
    </div>
  );
}
