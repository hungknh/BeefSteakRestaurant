import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { PromoCard } from "@/components/promotion/promo-card";
import { getPromotions } from "@/lib/data/promotions";
import { localeAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return {
    title: t("promotionsMetaTitle"),
    description: t("promotionsMetaDescription"),
    alternates: localeAlternates("/khuyen-mai", locale),
  };
}

// Force-dynamic: khuyến mãi đổi trong DB (admin bật/tắt) phải hiện ngay.
export const dynamic = "force-dynamic";

export default async function KhuyenMaiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [promotions, t] = await Promise.all([getPromotions(), getTranslations("Pages")]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={t("promotionsEyebrow")}
        title={t("promotionsTitle")}
        description={t("promotionsSubtitle")}
      />

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </div>
  );
}
