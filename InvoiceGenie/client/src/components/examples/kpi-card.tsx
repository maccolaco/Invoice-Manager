import { KPICard } from "../kpi-card";
import { DollarSign } from "lucide-react";

export default function KPICardExample() {
  return (
    <div className="p-8 max-w-sm">
      <KPICard
        title="Total Receivables"
        value="$45,231"
        icon={DollarSign}
        trend="+12% from last month"
        trendDirection="up"
      />
    </div>
  );
}
