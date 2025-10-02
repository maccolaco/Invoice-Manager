import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down";
}

export function KPICard({ title, value, icon: Icon, trend, trendDirection }: KPICardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1" data-testid={`text-${title.toLowerCase().replace(/\s/g, '-')}`}>{value}</p>
            {trend && (
              <p className={`text-xs mt-1 ${
                trendDirection === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}>
                {trend}
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
