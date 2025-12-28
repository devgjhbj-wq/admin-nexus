import { Transaction } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  isLoading?: boolean;
}

export function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg">Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm font-medium text-primary">
                {transaction.orderId}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">User ID</p>
              <p className="font-mono text-sm">{transaction.userId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <StatusBadge status={transaction.type} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <StatusBadge status={transaction.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className={`font-mono text-lg font-bold ${
                transaction.type === "deposit" ? "text-primary" : "text-accent"
              }`}>
                {transaction.type === "deposit" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
          </div>

          {transaction.meta?.bankAccount && (
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-2">Bank Details</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                <p className="font-medium">{transaction.meta.bankAccount.holderName}</p>
                <p className="text-muted-foreground">{transaction.meta.bankAccount.accountNumber}</p>
                <p className="text-muted-foreground">{transaction.meta.bankAccount.ifsc}</p>
                <p className="text-muted-foreground">{transaction.meta.bankAccount.bankName}</p>
              </div>
            </div>
          )}

          {transaction.status === "pending" && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                className="flex-1"
                onClick={() => onApprove(transaction.orderId)}
                disabled={isLoading}
              >
                Approve
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                onClick={() => onReject(transaction.orderId)}
                disabled={isLoading}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
