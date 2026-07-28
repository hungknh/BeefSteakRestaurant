import { Pill } from "@/components/admin/pill";
import { ORDER_STATUS_LABELS, RESERVATION_STATUS_LABELS } from "@/lib/format";
import type { OrderStatus, ReservationStatus } from "@/types";

const STATUS_TONE = {
  PENDING: "neutral",
  CONFIRMED: "gold-muted",
  PREPARING: "gold-muted",
  DELIVERING: "gold-muted",
  SEATED: "gold-muted",
  COMPLETED: "gold",
  CANCELLED: "maroon",
  NO_SHOW: "maroon",
} as const;

export function StatusBadge({ status }: { status: OrderStatus | ReservationStatus }) {
  const label =
    ORDER_STATUS_LABELS[status as OrderStatus] ??
    RESERVATION_STATUS_LABELS[status as ReservationStatus];
  return <Pill tone={STATUS_TONE[status]}>{label}</Pill>;
}
