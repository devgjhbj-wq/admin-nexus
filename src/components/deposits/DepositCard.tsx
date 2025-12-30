import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Deposit } from "@/lib/api";

interface DepositCardProps {
  deposit: Deposit;
  onClick: () => void;
}

export function DepositCard({ deposit, onClick }: DepositCardProps) {
  const getStatusKey = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "completed";
      case "pending":
        return "pending";
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:bg-secondary/50 active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-mono text-muted-foreground">
              {deposit.order_id}
            </p>
            <p className="text-sm font-medium text-foreground">
              ₹{deposit.amount.toLocaleString()}
            </p>
            {deposit.channel_name && (
              <p className="text-xs text-muted-foreground">
                {deposit.channel_name}
              </p>
            )}
          </div>
          <StatusBadge status={getStatusKey(deposit.status)} />
        </div>
      </CardContent>
    </Card>
  );
}
