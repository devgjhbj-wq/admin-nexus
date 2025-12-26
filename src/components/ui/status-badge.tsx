import { cn } from "@/lib/utils";

type Status = "completed" | "pending" | "failed" | "credit" | "debit" | "user" | "admin";

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  completed: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  credit: "bg-primary/10 text-primary border-primary/20",
  debit: "bg-accent/10 text-accent border-accent/20",
  user: "bg-secondary text-secondary-foreground border-border",
  admin: "bg-accent/10 text-accent border-accent/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || statusStyles.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
