import { bestPromotion, type CartLine } from "@/lib/promotions/apply";
import type { Promotion } from "@/types";

export type CartTotals = {
  subtotal: number;
  discount: number;
  /**
   * Trả về cả object khuyến mãi, KHÔNG chỉ `title`. Nếu chỉ trả title thì đó luôn là bản
   * tiếng Việt, và dòng "Ưu đãi: …" trong giỏ hàng hiện tiếng Việt ngay cả ở bản tiếng
   * Anh. Có object thì chỗ hiển thị tự gọi `promoTitle(promotion, locale)`.
   */
  promotion: Promotion | null;
  total: number;
};

export function computeCartTotals(
  lines: CartLine[],
  promos: Promotion[],
  now: Date,
  shippingFee = 0,
): CartTotals {
  const subtotal = lines.reduce((s, l) => s + l.dish.price * l.quantity, 0);
  const result = bestPromotion(lines, promos, now);
  const discount = result?.discount ?? 0;
  return {
    subtotal,
    discount,
    promotion: result?.promotion ?? null,
    total: Math.max(0, subtotal - discount) + shippingFee,
  };
}
