import { getPromotions } from "@/lib/data/promotions";
import { CheckoutForm } from "@/components/cart/checkout-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return { title: t("checkoutTitle") };
}
// Force-dynamic: bestPromotion() phải tính trên khuyến mãi mới nhất trong DB.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const t = await getTranslations("Pages");
  const promos = await getPromotions();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">{t("checkoutTitle")}</h1>
      <CheckoutForm promos={promos} />
    </div>
  );
}
