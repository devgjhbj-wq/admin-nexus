import { Transaction } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionCardProps {
  transaction: Transaction;
  onClick: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-accent/5 active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="font-mono text-sm font-medium text-primary">
              {transaction.orderId}
            </p>
            <StatusBadge status={transaction.type} />
          </div>
          <div className="text-right">
            <StatusBadge status={transaction.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
