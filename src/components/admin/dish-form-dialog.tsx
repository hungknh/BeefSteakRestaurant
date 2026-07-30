"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { categoryName } from "@/lib/i18n-content";
import type { DishFormValues } from "@/lib/validations/dish";
import type { Category, Dish } from "@/types";

const EMPTY_FORM: DishFormValues = {
  name: "",
  nameEn: "",
  description: "",
  descriptionEn: "",
  price: 0,
  imageUrl: "",
  categoryId: "",
  isAvailable: true,
  isFeatured: false,
  weightGram: null,
  hasDoneness: false,
};

/**
 * Dish (DB) -> giá trị form. Cần thiết vì các cột `*En` nullable trong DB nhưng input HTML
 * phải nhận string: nhồi `null` vào `value` sẽ làm input thành uncontrolled và React cảnh báo.
 */
function toFormValues(dish: Dish): DishFormValues {
  return {
    name: dish.name,
    nameEn: dish.nameEn ?? "",
    description: dish.description,
    descriptionEn: dish.descriptionEn ?? "",
    price: dish.price,
    imageUrl: dish.imageUrl,
    categoryId: dish.categoryId,
    isAvailable: dish.isAvailable,
    isFeatured: dish.isFeatured,
    weightGram: dish.weightGram,
    hasDoneness: dish.hasDoneness,
  };
}

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
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DishFormValues>(dish ? toFormValues(dish) : EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setForm(dish ? toFormValues(dish) : EMPTY_FORM);
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
          <DialogTitle className="font-serif">{dish ? t("dishes.form.editTitle") : t("dishes.form.addTitle")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="dish-name">{t("dishes.form.name")}</Label>
            <Input
              id="dish-name"
              className="mt-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dish-name-en">{t("dishes.form.nameEn")}</Label>
            <Input
              id="dish-name-en"
              className="mt-2"
              placeholder={t("dishes.form.nameEnPlaceholder")}
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dish-price">{t("dishes.form.price")}</Label>
              <Input
                id="dish-price"
                type="number"
                className="mt-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="dish-category">{t("dishes.form.category")}</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v ?? "" })}
              >
                <SelectTrigger id="dish-category" className="mt-2 w-full">
                  <SelectValue placeholder={t("dishes.form.categoryPlaceholder")}>
                    {(value: string) => {
                      const cat = categories.find((c) => c.id === value);
                      return cat ? categoryName(cat, locale) : "";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {categoryName(c, locale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="dish-description">{t("dishes.form.description")}</Label>
            <Textarea
              id="dish-description"
              className="mt-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dish-description-en">{t("dishes.form.descriptionEn")}</Label>
            <Textarea
              id="dish-description-en"
              className="mt-2"
              placeholder={t("dishes.form.descriptionEnPlaceholder")}
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dish-image">{t("dishes.form.imageUrl")}</Label>
            <Input
              id="dish-image"
              className="mt-2"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dish-weight">{t("dishes.form.weight")}</Label>
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
              {t("dishes.form.isAvailable")}
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="size-4 rounded border-border"
              />
              {t("dishes.form.isFeatured")}
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.hasDoneness}
                onChange={(e) => setForm({ ...form, hasDoneness: e.target.checked })}
                className="size-4 rounded border-border"
              />
              {t("dishes.form.hasDoneness")}
            </label>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {dish ? t("common.save") : t("dishes.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
