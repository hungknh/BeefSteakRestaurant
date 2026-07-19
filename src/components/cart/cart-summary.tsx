import { formatVND } from "@/lib/format";
import { computeCartTotals } from "@/lib/cart/totals";
import type { CartItem } from "@/store/cart";
import type { Promotion } from "@/types";

export function CartSummary({
  items,
  promos,
  shippingFee = 0,
}: {
  items: CartItem[];
  promos: Promotion[];
  shippingFee?: number;
}) {
  const totals = computeCartTotals(items, promos, new Date(), shippingFee);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>Tạm tính</span>
        <span>{formatVND(totals.subtotal)}</span>
      </div>
      {totals.discount > 0 ? (
        <div className="flex justify-between text-primary">
          <span>Ưu đãi: {totals.promotionTitle}</span>
          <span>-{formatVND(totals.discount)}</span>
        </div>
      ) : null}
      {shippingFee > 0 ? (
        <div className="flex justify-between text-muted-foreground">
          <span>Phí giao hàng</span>
          <span>{formatVND(shippingFee)}</span>
        </div>
      ) : null}
      <div className="mt-2 flex justify-between border-t border-border pt-3 font-serif text-lg text-foreground">
        <span>Tổng cộng</span>
        <span className="text-primary">{formatVND(totals.total)}</span>
      </div>
    </div>
  );
}
