import { formatVND } from "@/lib/format";
import { promoTitle } from "@/lib/i18n-content";
import { computeCartTotals } from "@/lib/cart/totals";
import type { CartItem } from "@/store/cart";
import type { Promotion } from "@/types";
import { useLocale, useTranslations } from "next-intl";

export function CartSummary({
  items,
  promos,
  shippingFee = 0,
}: {
  items: CartItem[];
  promos: Promotion[];
  shippingFee?: number;
}) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const totals = computeCartTotals(items, promos, new Date(), shippingFee);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 text-sm">
      <div className="flex justify-between text-muted-foreground">
        <span>{t("subtotal")}</span>
        <span>{formatVND(totals.subtotal)}</span>
      </div>
      {totals.discount > 0 ? (
        <div className="flex justify-between text-primary">
          <span>
            {t("discount")}: {totals.promotion ? promoTitle(totals.promotion, locale) : ""}
          </span>
          <span>-{formatVND(totals.discount)}</span>
        </div>
      ) : null}
      {shippingFee > 0 ? (
        <div className="flex justify-between text-muted-foreground">
          <span>{t("shipping")}</span>
          <span>{formatVND(shippingFee)}</span>
        </div>
      ) : null}
      <div className="mt-2 flex justify-between border-t border-border pt-3 font-sans text-lg text-foreground">
        <span>{t("total")}</span>
        <span className="text-primary">{formatVND(totals.total)}</span>
      </div>
    </div>
  );
}
