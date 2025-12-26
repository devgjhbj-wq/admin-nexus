import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:glow-primary",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-[10px] text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-[10px]",
                trend.isPositive ? "text-primary" : "text-destructive"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% from last period
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
    </div>
  );
}
