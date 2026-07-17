export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

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
