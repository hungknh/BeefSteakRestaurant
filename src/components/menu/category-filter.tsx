import Link from "next/link";
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
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link href="/thuc-don" className={pillClass(!active)}>
        Tất Cả
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/thuc-don?category=${category.slug}`}
          className={pillClass(active === category.slug)}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
