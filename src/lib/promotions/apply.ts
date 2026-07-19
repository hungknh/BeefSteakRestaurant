import type { Dish, Promotion } from "@/types";

export type CartLine = { dish: Dish; quantity: number };
export type PromoResult = { promotion: Promotion; discount: number } | null;

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toLocalTimeStr(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function isWithinDateRange(promo: Promotion, now: Date): boolean {
  const today = toLocalDateStr(now);
  if (promo.startDate && today < promo.startDate) return false;
  if (promo.endDate && today > promo.endDate) return false;
  return true;
}

function isOnAllowedDay(promo: Promotion, now: Date): boolean {
  if (!promo.daysOfWeek.trim()) return true;
  const allowed = promo.daysOfWeek.split(",").map((d) => Number(d.trim()));
  return allowed.includes(now.getDay());
}

function isWithinTimeWindow(promo: Promotion, now: Date): boolean {
  if (!promo.startTime || !promo.endTime) return true;
  const nowTime = toLocalTimeStr(now);
  const { startTime, endTime } = promo;
  // Khung giờ vắt qua nửa đêm (vd 22:00–02:00): endTime < startTime → so sánh OR thay vì AND.
  if (endTime < startTime) return nowTime >= startTime || nowTime < endTime;
  return nowTime >= startTime && nowTime < endTime;
}

function computeDiscount(promo: Promotion, lines: CartLine[]): number {
  const relevantLines = lines.filter((l) => {
    if (promo.scope === "DISH") return l.dish.id === promo.targetDishId;
    if (promo.scope === "CATEGORY") return l.dish.categoryId === promo.targetCategoryId;
    return true;
  });
  const relevantSubtotal = relevantLines.reduce((s, l) => s + l.dish.price * l.quantity, 0);
  if (relevantSubtotal === 0) return 0;

  if (promo.discountType === "PERCENT") {
    return Math.floor((relevantSubtotal * promo.discountValue) / 100);
  }
  if (promo.discountType === "FIXED") {
    return Math.min(promo.discountValue, relevantSubtotal);
  }
  return 0;
}

/** Trả về khuyến mãi tốt nhất áp được cho giỏ hàng tại thời điểm `now`. */
export function bestPromotion(lines: CartLine[], promos: Promotion[], now: Date): PromoResult {
  const subtotal = lines.reduce((s, l) => s + l.dish.price * l.quantity, 0);

  const applicable = promos
    .filter((p) => p.isActive)
    .filter((p) => isWithinDateRange(p, now))
    .filter((p) => isOnAllowedDay(p, now))
    .filter((p) => isWithinTimeWindow(p, now))
    .filter((p) => subtotal >= p.minSubtotal)
    .map((p) => ({ promotion: p, discount: computeDiscount(p, lines) }))
    .filter((r) => r.discount > 0);

  if (applicable.length === 0) return null;

  // ponytail: chỉ áp 1 khuyến mãi tốt nhất, không cộng dồn.
  // Cộng dồn cần rule ưu tiên + chặn giảm quá 100% → chưa cần. Đổi khi có yêu cầu thật.
  return applicable.reduce((best, cur) => (cur.discount > best.discount ? cur : best));
}
