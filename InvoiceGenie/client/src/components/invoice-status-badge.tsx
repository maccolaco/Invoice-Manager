import { Badge } from "@/components/ui/badge";

type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const variants: Record<InvoiceStatus, { color: string; label: string }> = {
    paid: { color: "bg-green-500/10 text-green-700 dark:text-green-400", label: "Paid" },
    unpaid: { color: "bg-amber-500/10 text-amber-700 dark:text-amber-400", label: "Unpaid" },
    overdue: { color: "bg-red-500/10 text-red-700 dark:text-red-400", label: "Overdue" },
    draft: { color: "bg-gray-500/10 text-gray-700 dark:text-gray-400", label: "Draft" },
  };

  const { color, label } = variants[status];

  return (
    <Badge
      variant="secondary"
      className={`${color} border-0 font-medium`}
      data-testid={`badge-status-${status}`}
    >
      {label}
    </Badge>
  );
}
