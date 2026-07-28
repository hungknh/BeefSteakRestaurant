"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/shared/price";
import { DishFormDialog } from "@/components/admin/dish-form-dialog";
import { Pill } from "@/components/admin/pill";
import { deleteDish } from "@/lib/actions/dish";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
import type { Category, Dish } from "@/types";

export function DishesTable({
  initialDishes,
  categories,
}: {
  initialDishes: Dish[];
  categories: Category[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Dish>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rows = useMemo(() => {
    const filtered = filterBySearch(initialDishes, search, (d) => d.name);
    return sortBy(filtered, sortKey, sortDir);
  }, [initialDishes, search, sortKey, sortDir]);

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
          placeholder="Tìm món ăn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <DishFormDialog
          categories={categories}
          onSaved={() => router.refresh()}
          trigger={
            <Button>
              <Plus className="size-4" strokeWidth={1.5} /> Thêm Món
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
                  Tên Món
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Danh Mục</th>
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  className="cursor-pointer rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={() => toggleSort("price")}
                >
                  Giá
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Trạng Thái</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((dish) => (
              <tr
                key={dish.id}
                className="border-b border-border transition-colors last:border-0 hover:bg-background-alt"
              >
                <td className="px-5 py-3 text-foreground">{dish.name}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {categories.find((c) => c.id === dish.categoryId)?.name ??
                    "—"}
                </td>
                <td className="px-5 py-3">
                  <Price amount={dish.price} className="text-sm" />
                </td>
                <td className="px-5 py-3">
                  <Pill tone={dish.isAvailable ? "gold-muted" : "neutral"}>
                    {dish.isAvailable ? "Còn Bán" : "Hết Món"}
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
                          aria-label="Sửa món"
                        >
                          <Pencil className="size-3.5" strokeWidth={1.5} />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Xóa món"
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
