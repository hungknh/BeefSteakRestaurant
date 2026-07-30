import { useLocale } from "next-intl";
import { Pill } from "@/components/admin/pill";
import { orderStatusLabel, reservationStatusLabel } from "@/lib/format";
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
  // useLocale (hook đồng bộ) chứ không phải getLocale — component này sync và được
  // dùng cả trong Server Component lẫn cây client. Xem "Sai khác" #63.
  const locale = useLocale();
  // Hai tập trạng thái trùng nhau ở PENDING/CONFIRMED/CANCELLED; SEATED/NO_SHOW chỉ có
  // ở đặt bàn nên tra bảng đơn hàng trước rồi mới rơi sang bảng đặt bàn.
  const label =
    orderStatusLabel(status as OrderStatus, locale) ??
    reservationStatusLabel(status as ReservationStatus, locale);
  return <Pill tone={STATUS_TONE[status]}>{label}</Pill>;
}
