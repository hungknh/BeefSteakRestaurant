"use client";

import { useState } from "react";
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
import type { Category, Dish } from "@/types";

type DishFormValues = Omit<Dish, "id" | "slug" | "category" | "avgRating" | "reviewCount">;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
  onSave,
  trigger,
}: {
  dish?: Dish;
  categories: Category[];
  onSave: (dish: Dish) => void;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DishFormValues>(dish ?? EMPTY_FORM);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setForm(dish ?? EMPTY_FORM);
  };

  const handleSubmit = () => {
    onSave({
      id: dish?.id ?? `dish-${Date.now()}`,
      slug: dish?.slug ?? slugify(form.name),
      avgRating: dish?.avgRating ?? 0,
      reviewCount: dish?.reviewCount ?? 0,
      ...form,
    });
    setOpen(false);
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
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{dish ? "Lưu Thay Đổi" : "Thêm Món"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
