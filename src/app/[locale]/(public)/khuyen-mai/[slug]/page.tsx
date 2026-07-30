import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarClock, Wallet } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { formatDaysOfWeek, formatVND } from "@/lib/format";
import { getPromotionBySlug } from "@/lib/data/promotions";
import { getCategories } from "@/lib/data/categories";
import { getDishes } from "@/lib/data/dishes";
import {
  categoryName,
  dishName,
  promoBadgeLabel,
  promoBadgeOffer,
  promoDescription,
  promoScheduleText,
  promoTitle,
} from "@/lib/i18n-content";
import { localeAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const promo = await getPromotionBySlug(slug);
  if (!promo) return {};
  const title = promoTitle(promo, locale);
  const description = promoDescription(promo, locale);
  return {
    title,
    description,
    alternates: localeAlternates(`/khuyen-mai/${promo.slug}`, locale),
    openGraph: {
      title,
      description,
      images: [{ url: promo.imageUrl, alt: title }],
    },
  };
}

export default async function PromotionDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const promo = await getPromotionBySlug(slug);
  if (!promo) notFound();

  const t = await getTranslations("PromotionDetail");

  let scopeText = t("scopeAll");
  if (promo.scope === "CATEGORY" && promo.targetCategoryId) {
    const categories = await getCategories();
    const category = categories.find((c) => c.id === promo.targetCategoryId);
    if (category) scopeText = t("scopeCategory", { name: categoryName(category, locale) });
  } else if (promo.scope === "DISH" && promo.targetDishId) {
    const dishes = await getDishes();
    const dish = dishes.find((d) => d.id === promo.targetDishId);
    if (dish) scopeText = t("scopeDish", { name: dishName(dish, locale) });
  }

  const discountText =
    promo.discountType === "PERCENT"
      ? t("discountPercent", { value: promo.discountValue })
      : promo.discountType === "FIXED"
        ? t("discountFixed", { amount: formatVND(promo.discountValue) })
        : null;

  const title = promoTitle(promo, locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={promo.imageUrl}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-badge-label px-3 py-1 text-xs font-medium text-foreground uppercase tracking-wider">
          {promoBadgeLabel(promo, locale)}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-badge-offer px-3 py-1 text-xs font-medium text-primary-foreground uppercase tracking-wider">
          {promoBadgeOffer(promo, locale)}
        </span>
      </div>

      <h1 className="mt-8 font-serif text-3xl text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{promoDescription(promo, locale)}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">{t("scheduleTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{promoScheduleText(promo, locale)}</p>
            <p className="text-sm text-muted-foreground">
              {formatDaysOfWeek(promo.daysOfWeek, locale)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Wallet className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">{t("conditionsTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{scopeText}</p>
            {promo.minSubtotal > 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("minSubtotal", { amount: formatVND(promo.minSubtotal) })}
              </p>
            ) : null}
            {discountText ? <p className="text-sm text-muted-foreground">{discountText}</p> : null}
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="mt-10"
        nativeButton={false}
        render={<Link href={`/dat-ban?promo=${promo.slug}`} />}
      >
        {t("bookWithOffer")}
      </Button>
    </div>
  );
}
