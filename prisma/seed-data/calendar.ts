// Hệ số theo ngày dùng để sinh dữ liệu lịch sử thực tế hơn: cuối tuần đông hơn ngày
// thường, tăng trưởng nhẹ theo thời gian (kênh đặt món online mới ra mắt), và các
// đợt cao điểm/thấp điểm theo văn hoá Việt Nam (Tết, Valentine, Giáng Sinh).
// Nguồn tham khảo mức tăng trưởng/tỉ lệ no-show: xem PROGRESS.md mục "Sai khác".

const WINDOW_START = new Date("2025-01-01T00:00:00Z");

// Mùng 1 Tết: 2025 = 29/01, 2026 = 17/02 (âm lịch). Đóng cửa/giảm giờ quanh Tết,
// cao điểm "tất niên" ~10 ngày trước đó.
const TET_DATES = [new Date("2025-01-29"), new Date("2026-02-17")];

function daysBetween(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

function isNearTet(date: Date): { dip: boolean; preTetBoost: boolean } {
  for (const tet of TET_DATES) {
    const diff = daysBetween(date, tet); // dương = sau Tết, âm = trước Tết
    if (diff >= -2 && diff <= 3) return { dip: true, preTetBoost: false };
    if (diff >= -12 && diff < -2) return { dip: false, preTetBoost: true };
  }
  return { dip: false, preTetBoost: false };
}

function isValentine(date: Date): boolean {
  return date.getMonth() === 1 && date.getDate() === 14; // tháng 2 (0-indexed)
}

function isChristmasPeriod(date: Date): boolean {
  const m = date.getMonth();
  const d = date.getDate();
  return (m === 11 && (d === 24 || d === 25)) || (m === 11 && d === 31);
}

const WEEKDAY_MULTIPLIER: Record<number, number> = {
  0: 1.25, // Chủ Nhật
  1: 0.65, // Thứ Hai
  2: 0.7,
  3: 0.75,
  4: 0.85,
  5: 1.15, // Thứ Sáu
  6: 1.45, // Thứ Bảy
};

/** Hệ số tăng trưởng dần theo thời gian — kênh đặt online mới, uy tín nhà hàng tăng. */
function growthMultiplier(date: Date): number {
  const totalSpan = daysBetween(new Date(), WINDOW_START);
  const elapsed = daysBetween(date, WINDOW_START);
  const progress = totalSpan > 0 ? Math.max(0, Math.min(1, elapsed / totalSpan)) : 0;
  return 1 + progress * 0.35; // ~1.0x lúc đầu -> ~1.35x hiện tại
}

/** Hệ số tổng hợp cho 1 ngày cụ thể — nhân với volume cơ sở để ra số đơn/đặt bàn kỳ vọng. */
export function dayMultiplier(date: Date): number {
  const { dip, preTetBoost } = isNearTet(date);
  if (dip) return 0.15;

  let multiplier = WEEKDAY_MULTIPLIER[date.getDay()] * growthMultiplier(date);
  if (preTetBoost) multiplier *= 1.7;
  if (isValentine(date)) multiplier *= 1.9;
  if (isChristmasPeriod(date)) multiplier *= 1.75;

  return multiplier;
}

export function isRomanticWindow(date: Date): boolean {
  return isValentine(date) || date.getDay() === 5 || date.getDay() === 6 || date.getDay() === 0;
}

export function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export { WINDOW_START };
