import type { Doneness, OrderStatus, ReservationStatus } from "@/types";

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const DONENESS_LABELS: Record<Doneness, string> = {
  RARE: "Tái",
  MEDIUM_RARE: "Tái Chín",
  MEDIUM: "Chín Vừa",
  MEDIUM_WELL: "Chín Vừa Kỹ",
  WELL_DONE: "Chín Kỹ",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Chờ Xác Nhận",
  CONFIRMED: "Đã Xác Nhận",
  PREPARING: "Đang Chuẩn Bị",
  DELIVERING: "Đang Giao",
  COMPLETED: "Hoàn Thành",
  CANCELLED: "Đã Hủy",
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Chờ Xác Nhận",
  CONFIRMED: "Đã Xác Nhận",
  SEATED: "Đã Nhận Bàn",
  CANCELLED: "Đã Hủy",
  NO_SHOW: "Không Đến",
};

const WEEKDAY_LABELS: Record<string, string> = {
  "0": "Chủ Nhật",
  "1": "Thứ Hai",
  "2": "Thứ Ba",
  "3": "Thứ Tư",
  "4": "Thứ Năm",
  "5": "Thứ Sáu",
  "6": "Thứ Bảy",
};

/** daysOfWeek là chuỗi CSV "1,4,6" (0=CN), rỗng = mọi ngày. Xem PLAN.md mục 5. */
export function formatDaysOfWeek(daysOfWeek: string): string {
  if (!daysOfWeek.trim()) return "Mọi ngày trong tuần";
  return daysOfWeek
    .split(",")
    .map((d) => WEEKDAY_LABELS[d.trim()])
    .filter(Boolean)
    .join(", ");
}
