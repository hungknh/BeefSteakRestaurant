import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  promoBadgeLabel,
  promoBadgeOffer,
  promoDescription,
  promoScheduleText,
  promoTitle,
} from "@/lib/i18n-content";
import type { Promotion } from "@/types";

export function PromoCard({ promo }: { promo: Promotion }) {
  const locale = useLocale();
  const t = useTranslations("Promotions");
  const title = promoTitle(promo, locale);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={promo.imageUrl}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-badge-label px-3 py-1 text-xs font-medium text-foreground uppercase tracking-wider">
          {promoBadgeLabel(promo, locale)}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-badge-offer px-3 py-1 text-xs font-medium text-primary-foreground uppercase tracking-wider">
          {promoBadgeOffer(promo, locale)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{promoDescription(promo, locale)}</p>
        <div className="flex items-center gap-2 text-xs text-primary-muted uppercase tracking-wider">
          <CalendarDays className="size-4" strokeWidth={1.5} />
          <span>{promoScheduleText(promo, locale)}</span>
        </div>
        <Button
          variant="gold-outline"
          size="sm"
          className="mt-2 w-fit"
          nativeButton={false}
          render={<Link href={`/khuyen-mai/${promo.slug}`} />}
        >
          {t("viewDetails")}
        </Button>
      </div>
    </div>
  );
}
