import { User } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-accent/5 active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-sm font-medium text-primary">
              {user.userId}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {user.mobileNumber}
            </p>
          </div>
          <div className="text-right space-y-1">
            <StatusBadge status={user.role} />
            <p className="font-mono text-sm font-medium">
              {formatCurrency(user.balance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
