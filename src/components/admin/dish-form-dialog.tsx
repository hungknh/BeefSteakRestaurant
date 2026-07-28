"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createDish, updateDish } from "@/lib/actions/dish";
import type { DishFormValues } from "@/lib/validations/dish";
import type { Category, Dish } from "@/types";

const EMPTY_FORM: DishFormValues = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  categoryId: "",
  isAvailable: true,
  isFeatured: false,
  weightGram: null,
  hasDoneness: false,
};

export function DishFormDialog({
  dish,
  categories,
  onSaved,
  trigger,
}: {
  dish?: Dish;
  categories: Category[];
  onSaved: () => void;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DishFormValues>(dish ?? EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setForm(dish ?? EMPTY_FORM);
      setError(null);
    }
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = dish ? await updateDish(dish.id, form) : await createDish(form);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      onSaved();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">{dish ? "Sửa Món Ăn" : "Thêm Món Ăn"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="dish-name">Tên món</Label>
            <Input
              id="dish-name"
              className="mt-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dish-price">Giá (VNĐ)</Label>
              <Input
                id="dish-price"
                type="number"
                className="mt-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="dish-category">Danh mục</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v ?? "" })}
              >
                <SelectTrigger id="dish-category" className="mt-2 w-full">
                  <SelectValue placeholder="Chọn danh mục">
                    {(value: string) => categories.find((c) => c.id === value)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="dish-description">Mô tả</Label>
            <Textarea
              id="dish-description"
              className="mt-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dish-image">Ảnh (URL)</Label>
            <Input
              id="dish-image"
              className="mt-2"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dish-weight">Trọng lượng (gram, để trống nếu không áp dụng)</Label>
            <Input
              id="dish-weight"
              type="number"
              className="mt-2"
              value={form.weightGram ?? ""}
              onChange={(e) =>
                setForm({ ...form, weightGram: e.target.value === "" ? null : Number(e.target.value) })
              }
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="size-4 rounded border-border"
              />
              Còn bán
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="size-4 rounded border-border"
              />
              Món nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.hasDoneness}
                onChange={(e) => setForm({ ...form, hasDoneness: e.target.checked })}
                className="size-4 rounded border-border"
              />
              Chọn được độ chín
            </label>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {dish ? "Lưu Thay Đổi" : "Thêm Món"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
