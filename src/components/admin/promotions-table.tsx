"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromotionFormDialog } from "@/components/admin/promotion-form-dialog";
import { formatDaysOfWeek } from "@/lib/format";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
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
  const [promotions, setPromotions] = useState(initialPromotions);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Promotion>("sortOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    const filtered = filterBySearch(promotions, search, (p) => p.title);
    return sortBy(filtered, sortKey, sortDir);
  }, [promotions, search, sortKey, sortDir]);

  const toggleSort = (key: keyof Promotion) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const upsertPromotion = (promotion: Promotion) => {
    setPromotions((prev) => {
      const exists = prev.some((p) => p.id === promotion.id);
      return exists ? prev.map((p) => (p.id === promotion.id ? promotion : p)) : [...prev, promotion];
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border p-5">
        <Input
          placeholder="Tìm khuyến mãi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <PromotionFormDialog
          categories={categories}
          dishes={dishes}
          onSave={upsertPromotion}
          trigger={
            <Button>
              <Plus className="size-4" strokeWidth={1.5} /> Thêm Khuyến Mãi
            </Button>
          }
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
            <th
              className="cursor-pointer px-5 py-3 font-medium"
              onClick={() => toggleSort("title")}
            >
              Tiêu Đề
            </th>
            <th className="px-5 py-3 font-medium">Giảm Giá</th>
            <th className="px-5 py-3 font-medium">Ngày Áp Dụng</th>
            <th className="px-5 py-3 font-medium">Trạng Thái</th>
            <th className="px-5 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {rows.map((promotion) => (
            <tr key={promotion.id} className="border-b border-border last:border-0">
              <td className="px-5 py-3 text-foreground">{promotion.title}</td>
              <td className="px-5 py-3 text-muted-foreground">
                {promotion.discountType === "PERCENT"
                  ? `${promotion.discountValue}%`
                  : `${promotion.discountValue.toLocaleString("vi-VN")}đ`}
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                {formatDaysOfWeek(promotion.daysOfWeek)}
              </td>
              <td className="px-5 py-3 text-muted-foreground">
                {promotion.isActive ? "Đang Chạy" : "Tạm Dừng"}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <PromotionFormDialog
                    promotion={promotion}
                    categories={categories}
                    dishes={dishes}
                    onSave={upsertPromotion}
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Sửa khuyến mãi">
                        <Pencil className="size-3.5" strokeWidth={1.5} />
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Xóa khuyến mãi"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setPromotions((prev) => prev.filter((p) => p.id !== promotion.id))
                    }
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
  );
}
