"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/shared/price";
import { DishFormDialog } from "@/components/admin/dish-form-dialog";
import { filterBySearch, sortBy } from "@/lib/admin/table-utils";
import type { Category, Dish } from "@/types";

export function DishesTable({
  initialDishes,
  categories,
}: {
  initialDishes: Dish[];
  categories: Category[];
}) {
  const [dishes, setDishes] = useState(initialDishes);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Dish>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    const filtered = filterBySearch(dishes, search, (d) => d.name);
    return sortBy(filtered, sortKey, sortDir);
  }, [dishes, search, sortKey, sortDir]);

  const toggleSort = (key: keyof Dish) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const upsertDish = (dish: Dish) => {
    setDishes((prev) => {
      const exists = prev.some((d) => d.id === dish.id);
      return exists
        ? prev.map((d) => (d.id === dish.id ? dish : d))
        : [...prev, dish];
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
          onSave={upsertDish}
          trigger={
            <Button>
              <Plus className="size-4" strokeWidth={1.5} /> Thêm Món
            </Button>
          }
        />
      </div>
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
                className="border-b border-border last:border-0"
              >
                <td className="px-5 py-3 text-foreground">{dish.name}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {categories.find((c) => c.id === dish.categoryId)?.name ??
                    "—"}
                </td>
                <td className="px-5 py-3">
                  <Price amount={dish.price} className="text-sm" />
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {dish.isAvailable ? "Còn Bán" : "Hết Món"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <DishFormDialog
                      dish={dish}
                      categories={categories}
                      onSave={upsertDish}
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
                      onClick={() =>
                        setDishes((prev) =>
                          prev.filter((d) => d.id !== dish.id),
                        )
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
    </div>
  );
}
