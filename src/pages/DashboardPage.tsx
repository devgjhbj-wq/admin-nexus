import { useQuery } from "@tanstack/react-query";
import { Users, CreditCard, Wallet, Activity } from "lucide-react";
import { fetchStats } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform metrics</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          description="Registered accounts"
        />
        <StatCard
          title="Total Transactions"
          value={stats?.totalTransactions ?? 0}
          icon={CreditCard}
          description="All time transactions"
        />
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats?.totalBalance ?? 0)}
          icon={Wallet}
          description="Combined user balance"
        />
      </div>

      {/* Activity Section */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">System Status</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-md bg-secondary/50 p-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-muted-foreground">API Server</span>
            <span className="ml-auto text-primary">Online</span>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-secondary/50 p-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-muted-foreground">Database</span>
            <span className="ml-auto text-primary">Connected</span>
          </div>
          <div className="flex items-center gap-3 rounded-md bg-secondary/50 p-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-muted-foreground">Auth Service</span>
            <span className="ml-auto text-primary">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
