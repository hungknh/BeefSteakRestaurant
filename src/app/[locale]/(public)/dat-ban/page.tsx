import { getPromotionBySlug } from "@/lib/data/promotions";
import { ReservationForm } from "@/components/reservation/reservation-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });
  // `alternates` BẮT BUỘC có: thiếu nó thì trang rơi về canonical mặc định của root
  // layout — tức là trang chủ — nên Google coi /dat-ban là bản trùng của trang chủ và
  // không index nó, dù trang này nằm trong sitemap và không bị robots.txt chặn.
  // Các trang thiếu `alternates` khác (/gio-hang, /thanh-toan, /dang-nhap, /dang-ky,
  // /tai-khoan) đều đã Disallow trong robots.txt nên không ảnh hưởng.
  return {
    title: t("reservationTitle"),
    alternates: localeAlternates("/dat-ban", locale),
  };
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
