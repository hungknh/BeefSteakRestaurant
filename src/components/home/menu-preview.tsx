import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/section-heading";
import { Price } from "@/components/shared/price";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getDishes } from "@/lib/data/dishes";
import { dishDescription, dishName } from "@/lib/i18n-content";

export async function MenuPreview() {
  // Server Component async: dùng getLocale/getTranslations, KHÔNG dùng hook useLocale.
  const [dishes, locale, t] = await Promise.all([
    getDishes(),
    getLocale(),
    getTranslations("Home.menuPreview"),
  ]);
  const featured = dishes.filter((d) => d.isFeatured).slice(0, 5);

  return (
    <section className="bg-background-alt py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg">
            <Image
              src="/images/menu-preview.jpg"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col divide-y divide-border">
            {featured.map((dish) => (
              <div key={dish.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={dish.imageUrl}
                    alt={dishName(dish, locale)}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="truncate font-serif text-base text-foreground">
                      {dishName(dish, locale)}
                    </h3>
                    <Price amount={dish.price} className="shrink-0 text-sm" />
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {dishDescription(dish, locale)}
                  </p>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Button variant="gold-outline" nativeButton={false} render={<Link href="/thuc-don" />}>
                {t("viewFullMenu")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
