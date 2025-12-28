import { User, LinkedAccount } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onViewLinked: (userId: string) => void;
  linkedAccounts?: LinkedAccount[];
  isLoadingLinked?: boolean;
  showLinked?: boolean;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onViewLinked,
  linkedAccounts,
  isLoadingLinked,
  showLinked,
}: UserDetailModalProps) {
  if (!user) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg">User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">User ID</p>
              <p className="font-mono text-sm font-medium text-primary">
                {user.userId}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Mobile</p>
              <p className="font-mono text-sm">{user.mobileNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <StatusBadge status={user.role} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p className="font-mono text-lg font-bold text-primary">
                {formatCurrency(user.balance)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Created</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(user.createdAt)}
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => onViewLinked(user.userId)}
            >
              <Link2 className="h-4 w-4" />
              View Linked Accounts
            </Button>
          </div>

          {showLinked && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Linked Accounts</p>
              {isLoadingLinked ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : linkedAccounts && linkedAccounts.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {linkedAccounts.map((account) => (
                    <div
                      key={account.userId}
                      className="bg-muted/50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-accent">{account.userId}</span>
                        <StatusBadge status={account.role} />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-muted-foreground">{account.mobileNumber}</span>
                        <span className="font-mono">{formatCurrency(account.balance)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No linked accounts found
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
