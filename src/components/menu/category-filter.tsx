import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryName } from "@/lib/i18n-content";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

function pillClass(active: boolean) {
  return cn(
    "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border text-muted-foreground hover:border-primary hover:text-primary",
  );
}

export function CategoryFilter({
  categories,
  active,
}: {
  categories: Category[];
  active?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Menu");

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link href="/thuc-don" className={pillClass(!active)}>
        {t("allCategories")}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/thuc-don?category=${category.slug}`}
          className={pillClass(active === category.slug)}
        >
          {categoryName(category, locale)}
        </Link>
      ))}
    </div>
  );
}
