import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { fetchTransactions, updateTransactionStatus, Transaction } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", page],
    queryFn: () => fetchTransactions(page),
  });

  const mutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: "completed" | "failed" }) =>
      updateTransactionStatus(orderId, status),
    onSuccess: () => {
      // Refresh transactions after update
      queryClient.invalidateQueries({ queryKey: ["transactions", page] });
    },
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const columns = [
    { key: "orderId", header: "Order ID", render: (tx: Transaction) => <span className="font-mono text-primary">{tx.orderId}</span> },
    { key: "userId", header: "User ID", render: (tx: Transaction) => <span className="font-mono">{tx.userId}</span> },
    { key: "type", header: "Type", render: (tx: Transaction) => <StatusBadge status={tx.type} /> },
    { key: "amount", header: "Amount", render: (tx: Transaction) => (
        <span className={`font-mono ${tx.type === "deposit" ? "text-primary" : "text-accent"}`}>
          {tx.type === "deposit" ? "+" : "-"}{formatCurrency(tx.amount)}
        </span>
      ) },
    { key: "status", header: "Status", render: (tx: Transaction) => <StatusBadge status={tx.status} /> },
    {
      key: "bankAccount",
      header: "Bank Details",
      render: (tx: Transaction) =>
        tx.meta?.bankAccount ? (
          <div className="text-sm">
            <div>{tx.meta.bankAccount.holderName}</div>
            <div className="text-muted-foreground">{tx.meta.bankAccount.accountNumber}</div>
            <div className="text-muted-foreground">{tx.meta.bankAccount.ifsc}</div>
            <div className="text-muted-foreground">{tx.meta.bankAccount.bankName}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    { key: "createdAt", header: "Date", render: (tx: Transaction) => <span className="text-muted-foreground">{formatDate(tx.createdAt)}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (tx: Transaction) =>
        tx.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => mutation.mutate({ orderId: tx.orderId, status: "completed" })}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => mutation.mutate({ orderId: tx.orderId, status: "failed" })}
            >
              Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">{data?.totalRecords ?? 0} total transactions</p>
        </div>
      </div>

      <DataTable<Transaction>
        columns={columns}
        data={data?.transactions ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="No transactions found"
      />
    </div>
  );
}
