export const TIME_SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
] as const;

export function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Disable khung giờ đã qua khi ngày được chọn là hôm nay. */
export function isSlotDisabled(slot: string, dateStr: string, now: Date): boolean {
  if (dateStr !== toLocalDateStr(now)) return false;
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return slot <= nowTime;
}

/** Nhận đặt bàn trước tối đa bao nhiêu ngày. */
export const MAX_BOOKING_DAYS_AHEAD = 90;

/**
 * Ngày đặt bàn có nằm trong khoảng cho phép không: từ hôm nay tới
 * `MAX_BOOKING_DAYS_AHEAD` ngày sau.
 *
 * ⚠️ Bắt buộc kiểm ở SERVER. Form có `<input type="date" min={today}>` nhưng `min` là
 * thuộc tính HTML — chỉ chặn người dùng bình thường, request tự soạn thì bỏ qua được.
 * Trước khi có hàm này, tạo được đặt bàn cho `2020-01-01`.
 *
 * Nhận `now` qua tham số (không gọi `new Date()` bên trong) để test được mà không phải
 * giả lập đồng hồ — cùng nguyên tắc với `bestPromotion`.
 */
export function isBookingDateAllowed(dateStr: string, now: Date): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  // So sánh bằng chuỗi `YYYY-MM-DD`: cùng định dạng thì thứ tự chuỗi = thứ tự ngày, và
  // tránh hẳn lệch múi giờ khi parse sang Date.
  const today = toLocalDateStr(now);
  if (dateStr < today) return false;

  const limit = new Date(now);
  limit.setDate(limit.getDate() + MAX_BOOKING_DAYS_AHEAD);
  return dateStr <= toLocalDateStr(limit);
}
