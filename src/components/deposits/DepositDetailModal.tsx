import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Deposit } from "@/lib/api";
import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

interface DepositDetailModalProps {
  deposit: Deposit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  isUpdating?: boolean;
}

export function DepositDetailModal({
  deposit,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isUpdating,
}: DepositDetailModalProps) {
  if (!deposit) return null;

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

  const isPending = deposit.status.toLowerCase() === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Deposit Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="text-sm font-mono font-medium">{deposit.order_id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm font-mono font-medium">{deposit.user_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="text-sm font-medium text-primary">
                ₹{deposit.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Currency</p>
              <p className="text-sm font-medium">{deposit.currency}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={getStatusKey(deposit.status)} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">UTR</p>
              <p className="text-sm font-mono">{deposit.utr || "N/A"}</p>
            </div>
          </div>

          {deposit.gateway_order_no && (
            <div>
              <p className="text-xs text-muted-foreground">Gateway Order No</p>
              <p className="text-sm font-mono break-all">
                {deposit.gateway_order_no}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Created At</p>
            <p className="text-sm">
              {format(new Date(deposit.created_at), "MMM dd, yyyy HH:mm:ss")}
            </p>
          </div>

          {isPending && onApprove && onReject && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="default"
                className="flex-1 gap-2"
                onClick={() => onApprove(deposit.order_id)}
                disabled={isUpdating}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => onReject(deposit.order_id)}
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
