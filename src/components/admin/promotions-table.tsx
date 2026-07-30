"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromotionFormDialog } from "@/components/admin/promotion-form-dialog";
import { Pill } from "@/components/admin/pill";
import { useLocale, useTranslations } from "next-intl";
import { formatDaysOfWeek, formatVND } from "@/lib/format";
import { deletePromotion } from "@/lib/actions/promotion";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
import { promoTitle } from "@/lib/i18n-content";
import type { Category, Dish, Promotion } from "@/types";

export function PromotionsTable({
  initialPromotions,
  categories,
  dishes,
}: {
  initialPromotions: Promotion[];
  categories: Category[];
  dishes: Dish[];
}) {
  const router = useRouter();
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Promotion>("sortOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rows = useMemo(() => {
    // Xem ghi chú cùng loại trong `dishes-table.tsx`.
    const filtered = filterBySearch(
      initialPromotions,
      search,
      (p) => `${p.title} ${promoTitle(p, locale)}`,
    );
    return sortBy(filtered, sortKey, sortDir);
  }, [initialPromotions, search, sortKey, sortDir, locale]);

  const toggleSort = (key: keyof Promotion) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = (promotion: Promotion) => {
    setError(null);
    setDeletingId(promotion.id);
    startTransition(async () => {
      const result = await deletePromotion(promotion.id);
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
          placeholder={t("promotions.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <PromotionFormDialog
          categories={categories}
          dishes={dishes}
          onSaved={() => router.refresh()}
          trigger={
            <Button>
              <Plus className="size-4" strokeWidth={1.5} /> {t("promotions.add")}
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
                  onClick={() => toggleSort("title")}
                >
                  {t("promotions.title")}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">{t("promotions.discount")}</th>
              <th className="px-5 py-3 font-medium">{t("promotions.days")}</th>
              <th className="px-5 py-3 font-medium">{t("common.status")}</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((promotion) => (
              <tr
                key={promotion.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-background-alt"
              >
                <td className="px-5 py-3 text-foreground">{promoTitle(promotion, locale)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {promotion.discountType === "PERCENT"
                    ? `${promotion.discountValue}%`
                    : formatVND(promotion.discountValue)}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {formatDaysOfWeek(promotion.daysOfWeek, locale)}
                </td>
                <td className="px-5 py-3">
                  <Pill tone={promotion.isActive ? "gold-muted" : "neutral"}>
                    {promotion.isActive ? t("promotions.active") : t("promotions.paused")}
                  </Pill>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <PromotionFormDialog
                      promotion={promotion}
                      categories={categories}
                      dishes={dishes}
                      onSaved={() => router.refresh()}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("promotions.editAria")}
                        >
                          <Pencil className="size-3.5" strokeWidth={1.5} />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("promotions.deleteAria")}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={deletingId === promotion.id}
                      onClick={() => handleDelete(promotion)}
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
