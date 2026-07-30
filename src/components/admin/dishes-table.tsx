"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/shared/price";
import { DishFormDialog } from "@/components/admin/dish-form-dialog";
import { Pill } from "@/components/admin/pill";
import { deleteDish } from "@/lib/actions/dish";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
import { categoryName, dishName } from "@/lib/i18n-content";
import type { Category, Dish } from "@/types";

export function DishesTable({
  initialDishes,
  categories,
}: {
  initialDishes: Dish[];
  categories: Category[];
}) {
  const router = useRouter();
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Dish>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rows = useMemo(() => {
    // Tìm theo cả tên Việt lẫn tên đang hiển thị — bản /en gõ tên tiếng Anh vẫn ra.
    const filtered = filterBySearch(
      initialDishes,
      search,
      (d) => `${d.name} ${dishName(d, locale)}`,
    );
    return sortBy(filtered, sortKey, sortDir);
  }, [initialDishes, search, sortKey, sortDir, locale]);

  const toggleSort = (key: keyof Dish) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = (dish: Dish) => {
    setError(null);
    setDeletingId(dish.id);
    startTransition(async () => {
      const result = await deleteDish(dish.id);
      setDeletingId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border p-5">
        <Input
          placeholder={t("dishes.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <DishFormDialog
          categories={categories}
          onSaved={() => router.refresh()}
          trigger={
            <Button>
              <Plus className="size-4" strokeWidth={1.5} /> {t("dishes.add")}
            </Button>
          }
        />
      </div>
      {error ? <p className="px-5 py-3 text-sm text-destructive">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("name")}
                >
                  {t("dishes.name")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">{t("common.category")}</th>
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("price")}
                >
                  {t("dishes.price")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">{t("common.status")}</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((dish) => (
              <tr
                key={dish.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-background-alt"
              >
                <td className="px-5 py-3 text-foreground">{dishName(dish, locale)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {(() => {
                    const cat = categories.find((c) => c.id === dish.categoryId);
                    return cat ? categoryName(cat, locale) : "—";
                  })()}
                </td>
                <td className="px-5 py-3">
                  <Price amount={dish.price} className="text-sm" />
                </td>
                <td className="px-5 py-3">
                  <Pill tone={dish.isAvailable ? "gold-muted" : "neutral"}>
                    {dish.isAvailable ? t("dishes.available") : t("dishes.soldOut")}
                  </Pill>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <DishFormDialog
                      dish={dish}
                      categories={categories}
                      onSaved={() => router.refresh()}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("dishes.editAria")}
                        >
                          <Pencil className="size-3.5" strokeWidth={1.5} />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("dishes.deleteAria")}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={deletingId === dish.id}
                      onClick={() => handleDelete(dish)}
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.5} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
