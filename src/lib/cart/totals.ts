import { bestPromotion, type CartLine } from "@/lib/promotions/apply";
import type { Promotion } from "@/types";

export type CartTotals = {
  subtotal: number;
  discount: number;
  promotionTitle: string | null;
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
    promotionTitle: result?.promotion.title ?? null,
    total: Math.max(0, subtotal - discount) + shippingFee,
  };
}
