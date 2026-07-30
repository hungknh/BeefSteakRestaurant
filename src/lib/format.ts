import type { Doneness, OrderStatus, ReservationStatus } from "@/types";

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Nhãn trạng thái / độ chín theo ngôn ngữ.
 *
 * Giữ dạng bảng tra trong code (không đưa vào `messages/*.json`) vì key là giá trị enum
 * của DB — tra ở đây thì TypeScript kiểm được đủ nhánh (`Record<OrderStatus, string>`),
 * còn để trong JSON thì thêm trạng thái mới sẽ lặng lẽ hiện key thay vì lỗi lúc build.
 *
 * Khu admin cố tình chỉ dùng bản tiếng Việt (xem PROGRESS.md #59).
 */

export const DONENESS_LABELS_BY_LOCALE: Record<string, Record<Doneness, string>> = {
  vi: {
    RARE: "Tái",
    MEDIUM_RARE: "Tái Chín",
    MEDIUM: "Chín Vừa",
    MEDIUM_WELL: "Chín Vừa Kỹ",
    WELL_DONE: "Chín Kỹ",
  },
  en: {
    RARE: "Rare",
    MEDIUM_RARE: "Medium Rare",
    MEDIUM: "Medium",
    MEDIUM_WELL: "Medium Well",
    WELL_DONE: "Well Done",
  },
};

export const ORDER_STATUS_LABELS_BY_LOCALE: Record<string, Record<OrderStatus, string>> = {
  vi: {
    PENDING: "Chờ Xác Nhận",
    CONFIRMED: "Đã Xác Nhận",
    PREPARING: "Đang Chuẩn Bị",
    DELIVERING: "Đang Giao",
    COMPLETED: "Hoàn Thành",
    CANCELLED: "Đã Hủy",
  },
  en: {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    DELIVERING: "Out for Delivery",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  },
};

export const RESERVATION_STATUS_LABELS_BY_LOCALE: Record<
  string,
  Record<ReservationStatus, string>
> = {
  vi: {
    PENDING: "Chờ Xác Nhận",
    CONFIRMED: "Đã Xác Nhận",
    SEATED: "Đã Nhận Bàn",
    CANCELLED: "Đã Hủy",
    NO_SHOW: "Không Đến",
  },
  en: {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    SEATED: "Seated",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
  },
};

export function donenessLabel(doneness: Doneness, locale = "vi"): string {
  return (DONENESS_LABELS_BY_LOCALE[locale] ?? DONENESS_LABELS_BY_LOCALE.vi)[doneness];
}

export function orderStatusLabel(status: OrderStatus, locale = "vi"): string {
  return (ORDER_STATUS_LABELS_BY_LOCALE[locale] ?? ORDER_STATUS_LABELS_BY_LOCALE.vi)[status];
}

export function reservationStatusLabel(status: ReservationStatus, locale = "vi"): string {
  return (RESERVATION_STATUS_LABELS_BY_LOCALE[locale] ??
    RESERVATION_STATUS_LABELS_BY_LOCALE.vi)[status];
}

// Giữ tên cũ cho khu admin (chỉ tiếng Việt) — nhiều chỗ đang dùng, không cần sửa.
export const DONENESS_LABELS = DONENESS_LABELS_BY_LOCALE.vi;
export const ORDER_STATUS_LABELS = ORDER_STATUS_LABELS_BY_LOCALE.vi;
export const RESERVATION_STATUS_LABELS = RESERVATION_STATUS_LABELS_BY_LOCALE.vi;

const WEEKDAY_LABELS: Record<string, Record<string, string>> = {
  vi: {
    "0": "Chủ Nhật",
    "1": "Thứ Hai",
    "2": "Thứ Ba",
    "3": "Thứ Tư",
    "4": "Thứ Năm",
    "5": "Thứ Sáu",
    "6": "Thứ Bảy",
  },
  en: {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
  },
};

const EVERY_DAY: Record<string, string> = {
  vi: "Mọi ngày trong tuần",
  en: "Every day of the week",
};

/**
 * daysOfWeek là chuỗi CSV "1,4,6" (0=CN), rỗng = mọi ngày. Xem PLAN.md mục 5.
 * `locale` mặc định "vi" để chỗ gọi cũ không phải sửa; truyền "en" cho bản tiếng Anh.
 */
export function formatDaysOfWeek(daysOfWeek: string, locale = "vi"): string {
  const labels = WEEKDAY_LABELS[locale] ?? WEEKDAY_LABELS.vi;
  if (!daysOfWeek.trim()) return EVERY_DAY[locale] ?? EVERY_DAY.vi;
  return daysOfWeek
    .split(",")
    .map((d) => labels[d.trim()])
    .filter(Boolean)
    .join(", ");
}
