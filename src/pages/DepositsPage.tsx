import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DepositCard } from "@/components/deposits/DepositCard";
import { DepositDetailModal } from "@/components/deposits/DepositDetailModal";
import { fetchDeposits, updateDepositStatus, Deposit } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DepositsPage() {
  const [page, setPage] = useState(1);
  const [searchUserId, setSearchUserId] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const [activeOrderId, setActiveOrderId] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["deposits", page, activeUserId, activeOrderId],
    queryFn: () => fetchDeposits(page, activeUserId || undefined, activeOrderId || undefined),
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status, note }: { orderId: string; status: "SUCCESS" | "FAILED"; note: string }) =>
      updateDepositStatus(orderId, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deposits"] });
      setIsModalOpen(false);
      toast({
        title: "Status Updated",
        description: "Deposit status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCardClick = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setIsModalOpen(true);
  };

  const handleApprove = (orderId: string) => {
    statusMutation.mutate({ orderId, status: "SUCCESS", note: "Payment verified by admin" });
  };

  const handleReject = (orderId: string) => {
    statusMutation.mutate({ orderId, status: "FAILED", note: "Payment rejected by admin" });
  };

  const handleSearch = () => {
    setPage(1);
    setActiveUserId(searchUserId);
    setActiveOrderId(searchOrderId);
  };

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

  const columns = [
    {
      key: "order_id" as keyof Deposit,
      header: "Order ID",
      render: (deposit: Deposit) => (
        <span className="font-mono text-xs">{deposit.order_id}</span>
      ),
    },
    {
      key: "user_id" as keyof Deposit,
      header: "User ID",
      render: (deposit: Deposit) => (
        <span className="font-mono text-xs">{deposit.user_id}</span>
      ),
    },
    {
      key: "amount" as keyof Deposit,
      header: "Amount",
      render: (deposit: Deposit) => (
        <span className="font-medium text-primary">
          ₹{deposit.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status" as keyof Deposit,
      header: "Status",
      render: (deposit: Deposit) => (
        <StatusBadge status={getStatusKey(deposit.status)} />
      ),
    },
    {
      key: "utr" as keyof Deposit,
      header: "UTR",
      render: (deposit: Deposit) => (
        <span className="font-mono text-xs">{deposit.utr || "N/A"}</span>
      ),
    },
    {
      key: "created_at" as keyof Deposit,
      header: "Date",
      render: (deposit: Deposit) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(deposit.created_at), "MMM dd, HH:mm")}
        </span>
      ),
    },
    {
      key: "actions" as keyof Deposit,
      header: "Actions",
      render: (deposit: Deposit) => {
        const isPending = deposit.status.toLowerCase() === "pending";
        if (!isPending) return null;
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-primary hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(deposit.order_id);
              }}
              disabled={statusMutation.isPending}
            >
              <CheckCircle className="h-3 w-3" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleReject(deposit.order_id);
              }}
              disabled={statusMutation.isPending}
            >
              <XCircle className="h-3 w-3" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const renderMobileView = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      );
    }

    const deposits = data?.deposits || [];

    return (
      <div className="space-y-3">
        {deposits.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No deposits found
          </div>
        ) : (
          deposits.map((deposit) => (
            <DepositCard
              key={deposit.order_id}
              deposit={deposit}
              onClick={() => handleCardClick(deposit)}
            />
          ))
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deposits</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total || 0} total deposits
          </p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by User ID..."
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID..."
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {isMobile ? (
        renderMobileView()
      ) : (
        <DataTable
          columns={columns}
          data={data?.deposits || []}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onRowClick={handleCardClick}
          emptyMessage="No deposits found"
        />
      )}

      <DepositDetailModal
        deposit={selectedDeposit}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        isUpdating={statusMutation.isPending}
      />
    </div>
  );
}
