import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Link2 } from "lucide-react";
import { fetchUsers, fetchLinkedAccounts, User, LinkedAccount } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
  });

  const { data: linkedData, isLoading: isLoadingLinked } = useQuery({
    queryKey: ["linkedAccounts", selectedUser],
    queryFn: () => fetchLinkedAccounts(selectedUser!),
    enabled: !!selectedUser,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns = [
    {
      key: "userId",
      header: "User ID",
      render: (user: User) => (
        <span className="font-mono text-primary">{user.userId}</span>
      ),
    },
    {
      key: "mobileNumber",
      header: "Mobile",
      render: (user: User) => (
        <span className="font-mono">{user.mobileNumber}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user: User) => <StatusBadge status={user.role} />,
    },
    {
      key: "balance",
      header: "Balance",
      render: (user: User) => (
        <span className="font-mono">{formatCurrency(user.balance)}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (user: User) => (
        <span className="text-muted-foreground">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-[10px] hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user.userId);
          }}
        >
          <Link2 className="h-3 w-3" />
          Linked
        </Button>
      ),
    },
  ];

  const linkedColumns = [
    {
      key: "userId",
      header: "User ID",
      render: (account: LinkedAccount) => (
        <span className="font-mono text-accent">{account.userId}</span>
      ),
    },
    {
      key: "mobileNumber",
      header: "Mobile",
      render: (account: LinkedAccount) => (
        <span className="font-mono">{account.mobileNumber}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (account: LinkedAccount) => <StatusBadge status={account.role} />,
    },
    {
      key: "balance",
      header: "Balance",
      render: (account: LinkedAccount) => (
        <span className="font-mono">{formatCurrency(account.balance)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            {data?.totalRecords ?? 0} registered users
          </p>
        </div>
      </div>

      <DataTable<User>
        columns={columns}
        data={data?.users ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No users found"
      />

      {/* Linked Accounts Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-accent" />
              Linked Accounts for {selectedUser}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="mb-4 text-muted-foreground">
              Accounts sharing the same device ID, IP address, or ad ID:
            </p>
            <DataTable<LinkedAccount>
              columns={linkedColumns}
              data={linkedData?.linkedAccounts ?? []}
              isLoading={isLoadingLinked}
              emptyMessage="No linked accounts found"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
