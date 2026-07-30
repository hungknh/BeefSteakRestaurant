import { getPromotions } from "@/lib/data/promotions";
import { CartPageView } from "@/components/cart/cart-page-view";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return { title: t("cartTitle") };
}
// Force-dynamic: bestPromotion() phải tính trên khuyến mãi mới nhất trong DB.
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const [promos, t] = await Promise.all([getPromotions(), getTranslations("Cart")]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">{t("title")}</h1>
      <CartPageView promos={promos} />
    </div>
  );
}
