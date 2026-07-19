import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, RESERVATION_STATUS_LABELS } from "@/lib/format";
import type { OrderStatus, ReservationStatus } from "@/types";

const STATUS_TONE: Record<string, string> = {
  PENDING: "border-border text-muted-foreground",
  CONFIRMED: "border-primary text-primary",
  PREPARING: "border-primary text-primary",
  DELIVERING: "border-primary text-primary",
  SEATED: "border-primary text-primary",
  COMPLETED: "border-primary bg-primary text-primary-foreground",
  CANCELLED: "border-destructive text-destructive",
  NO_SHOW: "border-destructive text-destructive",
};

export function StatusBadge({ status }: { status: OrderStatus | ReservationStatus }) {
  const label =
    ORDER_STATUS_LABELS[status as OrderStatus] ??
    RESERVATION_STATUS_LABELS[status as ReservationStatus];
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        STATUS_TONE[status],
      )}
    >
      {label}
    </span>
  );
}
