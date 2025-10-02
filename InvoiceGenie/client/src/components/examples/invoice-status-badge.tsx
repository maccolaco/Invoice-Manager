import { InvoiceStatusBadge } from "../invoice-status-badge";

export default function InvoiceStatusBadgeExample() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-2">
        <InvoiceStatusBadge status="paid" />
        <InvoiceStatusBadge status="unpaid" />
        <InvoiceStatusBadge status="overdue" />
        <InvoiceStatusBadge status="draft" />
      </div>
    </div>
  );
}
