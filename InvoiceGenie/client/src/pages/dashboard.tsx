import { KPICard } from "@/components/kpi-card";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  Upload,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "wouter";

export default function Dashboard() {
  const chartData = [
    { month: "Jan", receivables: 12000, payables: 8000 },
    { month: "Feb", receivables: 15000, payables: 9500 },
    { month: "Mar", receivables: 18000, payables: 11000 },
    { month: "Apr", receivables: 16000, payables: 10500 },
    { month: "May", receivables: 21000, payables: 12500 },
    { month: "Jun", receivables: 19000, payables: 11800 },
  ];

  const recentInvoices = [
    { id: "INV-001", vendor: "Acme Corp", amount: "$2,450", dueDate: "2024-10-15", status: "unpaid" as const },
    { id: "INV-002", vendor: "Global LLC", amount: "$5,230", dueDate: "2024-10-05", status: "overdue" as const },
    { id: "INV-003", vendor: "Tech Solutions", amount: "$1,850", dueDate: "2024-09-28", status: "paid" as const },
    { id: "INV-004", vendor: "Office Supplies Co", amount: "$890", dueDate: "2024-10-20", status: "unpaid" as const },
    { id: "INV-005", vendor: "Marketing Agency", amount: "$3,200", dueDate: "2024-09-30", status: "paid" as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Overview of your invoices and financial metrics
          </p>
        </div>
        <Link href="/invoices?action=upload">
          <Button size="sm" data-testid="button-upload-invoice">
            <Upload className="h-4 w-4 mr-2" />
            Upload Invoice
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Receivables"
          value="$45,231"
          icon={DollarSign}
          trend="+12% from last month"
          trendDirection="up"
        />
        <KPICard
          title="Total Payables"
          value="$28,450"
          icon={Wallet}
          trend="+8% from last month"
          trendDirection="up"
        />
        <KPICard
          title="Overdue Invoices"
          value="3"
          icon={AlertCircle}
          trend="-2 from last week"
          trendDirection="down"
        />
        <KPICard
          title="Net Cash Flow"
          value="$16,781"
          icon={TrendingUp}
          trend="+15% from last month"
          trendDirection="up"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.375rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="receivables"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Receivables"
              />
              <Line
                type="monotone"
                dataKey="payables"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Payables"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Recent Invoices</CardTitle>
          <Link href="/invoices">
            <Button variant="ghost" size="sm" data-testid="button-view-all">
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-2 rounded-lg border hover-elevate cursor-pointer"
                data-testid={`invoice-row-${invoice.id}`}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-mono font-medium text-xs">{invoice.id}</p>
                    <p className="text-xs text-muted-foreground">{invoice.vendor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-sm">{invoice.amount}</p>
                    <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                  </div>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
