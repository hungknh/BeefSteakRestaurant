import { getPromotionBySlug } from "@/lib/data/promotions";
import { ReservationForm } from "@/components/reservation/reservation-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  return { title: t("reservationTitle") };
}

type Props = { searchParams: Promise<{ promo?: string }> };

export default async function ReservationPage({ searchParams }: Props) {
  const t = await getTranslations("Pages");
  const { promo: promoSlug } = await searchParams;
  const promo = promoSlug ? await getPromotionBySlug(promoSlug) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl text-foreground sm:text-4xl">{t("reservationTitle")}</h1>
      <ReservationForm promo={promo} />
    </div>
  );
}
