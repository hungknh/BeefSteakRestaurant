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
import { cn } from "@/lib/utils";
import { createPromotion, updatePromotion } from "@/lib/actions/promotion";
import type { PromotionFormValues } from "@/lib/validations/promotion";
import { categoryName, dishName } from "@/lib/i18n-content";
import type { Category, Dish, Promotion } from "@/types";

// Bảng KEY chứ không phải chữ — hằng số ở cấp module không gọi được `t()`
// (hook chỉ chạy trong component). Dịch lúc render.
const DISCOUNT_TYPE_KEYS: Record<Promotion["discountType"], string> = {
  PERCENT: "percent",
  FIXED: "fixed",
  NONE: "none",
};

const SCOPE_KEYS: Record<Promotion["scope"], string> = {
  ALL: "scopeAll",
  CATEGORY: "scopeCategory",
  DISH: "scopeDish",
};

// value = thứ theo chuẩn JS getDay() (0 = Chủ Nhật), khớp cột `daysOfWeek` trong DB.
const DAY_OPTIONS = [
  { value: "1", key: "mon" },
  { value: "2", key: "tue" },
  { value: "3", key: "wed" },
  { value: "4", key: "thu" },
  { value: "5", key: "fri" },
  { value: "6", key: "sat" },
  { value: "0", key: "sun" },
] as const;

const EMPTY_FORM: PromotionFormValues = {
  title: "",
  titleEn: "",
  description: "",
  descriptionEn: "",
  imageUrl: "",
  badgeLabel: "",
  badgeLabelEn: "",
  badgeOffer: "",
  badgeOfferEn: "",
  scheduleText: "",
  scheduleTextEn: "",
  discountType: "PERCENT",
  discountValue: 10,
  scope: "ALL",
  targetCategoryId: null,
  targetDishId: null,
  daysOfWeek: "",
  startTime: null,
  endTime: null,
  minSubtotal: 0,
  startDate: null,
  endDate: null,
  isActive: true,
  sortOrder: 1,
};

/**
 * Promotion (DB) -> giá trị form. Các cột `*En` nullable trong DB nhưng input HTML phải
 * nhận string: nhồi `null` vào `value` làm input thành uncontrolled và React cảnh báo.
 */
function toFormValues(p: Promotion): PromotionFormValues {
  return {
    ...p,
    titleEn: p.titleEn ?? "",
    descriptionEn: p.descriptionEn ?? "",
    badgeLabelEn: p.badgeLabelEn ?? "",
    badgeOfferEn: p.badgeOfferEn ?? "",
    scheduleTextEn: p.scheduleTextEn ?? "",
  };
}

export function PromotionFormDialog({
  promotion,
  categories,
  dishes,
  onSaved,
  trigger,
}: {
  promotion?: Promotion;
  categories: Category[];
  dishes: Dish[];
  onSaved: () => void;
  trigger: React.ReactElement;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PromotionFormValues>(promotion ? toFormValues(promotion) : EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setForm(promotion ? toFormValues(promotion) : EMPTY_FORM);
      setError(null);
    }
  };

  const selectedDays = form.daysOfWeek ? form.daysOfWeek.split(",") : [];

  const toggleDay = (value: string) => {
    const next = selectedDays.includes(value)
      ? selectedDays.filter((d) => d !== value)
      : [...selectedDays, value];
    setForm({ ...form, daysOfWeek: next.join(",") });
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = promotion
        ? await updatePromotion(promotion.id, form)
        : await createPromotion(form);
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
          <DialogTitle className="font-serif">
            {promotion ? t("promotions.form.editTitle") : t("promotions.form.addTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          <div>
            <Label htmlFor="promo-title">{t("promotions.form.title")}</Label>
            <Input
              id="promo-title"
              className="mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="promo-description">{t("promotions.form.description")}</Label>
            <Textarea
              id="promo-description"
              className="mt-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {/* Khối bản dịch — gom lại một chỗ để admin thấy rõ đây là phần tiếng Anh,
              và mọi ô đều không bắt buộc. */}
          <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("promotions.form.enSection")}
            </p>
            <div>
              <Label htmlFor="promo-title-en">{t("promotions.form.titleEn")}</Label>
              <Input
                id="promo-title-en"
                className="mt-2"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="promo-description-en">{t("promotions.form.descriptionEn")}</Label>
              <Textarea
                id="promo-description-en"
                className="mt-2"
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promo-badge-label-en">{t("promotions.form.badgeLabelEn")}</Label>
                <Input
                  id="promo-badge-label-en"
                  className="mt-2"
                  placeholder="VD: DAILY"
                  value={form.badgeLabelEn}
                  onChange={(e) => setForm({ ...form, badgeLabelEn: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="promo-badge-offer-en">{t("promotions.form.badgeOfferEn")}</Label>
                <Input
                  id="promo-badge-offer-en"
                  className="mt-2"
                  placeholder="VD: 30% OFF"
                  value={form.badgeOfferEn}
                  onChange={(e) => setForm({ ...form, badgeOfferEn: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="promo-schedule-text-en">{t("promotions.form.scheduleTextEn")}</Label>
              <Input
                id="promo-schedule-text-en"
                className="mt-2"
                placeholder="VD: EVERY THURSDAY"
                value={form.scheduleTextEn}
                onChange={(e) => setForm({ ...form, scheduleTextEn: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-image">{t("promotions.form.imageUrl")}</Label>
            <Input
              id="promo-image"
              className="mt-2"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-badge-label">{t("promotions.form.badgeLabel")}</Label>
              <Input
                id="promo-badge-label"
                className="mt-2"
                placeholder={t("promotions.form.badgeLabelPlaceholder")}
                value={form.badgeLabel}
                onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="promo-badge-offer">{t("promotions.form.badgeOffer")}</Label>
              <Input
                id="promo-badge-offer"
                className="mt-2"
                placeholder={t("promotions.form.badgeOfferPlaceholder")}
                value={form.badgeOffer}
                onChange={(e) => setForm({ ...form, badgeOffer: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-schedule-text">{t("promotions.form.scheduleText")}</Label>
            <Input
              id="promo-schedule-text"
              className="mt-2"
              placeholder={t("promotions.form.scheduleTextPlaceholder")}
              value={form.scheduleText}
              onChange={(e) => setForm({ ...form, scheduleText: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-discount-type">{t("promotions.form.discountType")}</Label>
              <Select
                value={form.discountType}
                onValueChange={(v) =>
                  setForm({ ...form, discountType: (v ?? "PERCENT") as Promotion["discountType"] })
                }
              >
                <SelectTrigger id="promo-discount-type" className="mt-2 w-full">
                  <SelectValue>
                    {(value: Promotion["discountType"]) =>
                      t(`promotions.form.${DISCOUNT_TYPE_KEYS[value]}`)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENT">{t("promotions.form.percent")}</SelectItem>
                  <SelectItem value="FIXED">{t("promotions.form.fixed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="promo-discount-value">{t("promotions.form.discountValue")}</Label>
              <Input
                id="promo-discount-value"
                type="number"
                className="mt-2"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-scope">{t("promotions.form.scope")}</Label>
            <Select
              value={form.scope}
              onValueChange={(v) =>
                setForm({ ...form, scope: (v ?? "ALL") as Promotion["scope"] })
              }
            >
              <SelectTrigger id="promo-scope" className="mt-2 w-full">
                <SelectValue>
                  {(value: Promotion["scope"]) => t(`promotions.form.${SCOPE_KEYS[value]}`)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("promotions.form.scopeAll")}</SelectItem>
                <SelectItem value="CATEGORY">{t("promotions.form.scopeCategory")}</SelectItem>
                <SelectItem value="DISH">{t("promotions.form.scopeDish")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.scope === "CATEGORY" ? (
            <div>
              <Label htmlFor="promo-category">{t("promotions.form.category")}</Label>
              <Select
                value={form.targetCategoryId ?? ""}
                onValueChange={(v) => setForm({ ...form, targetCategoryId: v ?? null })}
              >
                <SelectTrigger id="promo-category" className="mt-2 w-full">
                  <SelectValue placeholder={t("promotions.form.categoryPlaceholder")}>
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
          ) : null}
          {form.scope === "DISH" ? (
            <div>
              <Label htmlFor="promo-dish">{t("promotions.form.dish")}</Label>
              <Select
                value={form.targetDishId ?? ""}
                onValueChange={(v) => setForm({ ...form, targetDishId: v ?? null })}
              >
                <SelectTrigger id="promo-dish" className="mt-2 w-full">
                  <SelectValue placeholder={t("promotions.form.dishPlaceholder")}>
                    {(value: string) => {
                      const d = dishes.find((x) => x.id === value);
                      return d ? dishName(d, locale) : "";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {dishes.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {dishName(d, locale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div>
            <Label>{t("promotions.form.daysOfWeek")}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DAY_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={cn(
                    "rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    selectedDays.includes(d.value) &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                >
                  {t(`common.dayShort.${d.key}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-start-time">{t("promotions.form.startTime")}</Label>
              <Input
                id="promo-start-time"
                type="time"
                className="mt-2"
                value={form.startTime ?? ""}
                onChange={(e) => setForm({ ...form, startTime: e.target.value || null })}
              />
            </div>
            <div>
              <Label htmlFor="promo-end-time">{t("promotions.form.endTime")}</Label>
              <Input
                id="promo-end-time"
                type="time"
                className="mt-2"
                value={form.endTime ?? ""}
                onChange={(e) => setForm({ ...form, endTime: e.target.value || null })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-start-date">{t("promotions.form.startDate")}</Label>
              <Input
                id="promo-start-date"
                type="date"
                className="mt-2"
                value={form.startDate ?? ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value || null })}
              />
            </div>
            <div>
              <Label htmlFor="promo-end-date">{t("promotions.form.endDate")}</Label>
              <Input
                id="promo-end-date"
                type="date"
                className="mt-2"
                value={form.endDate ?? ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value || null })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-min-subtotal">{t("promotions.form.minSubtotal")}</Label>
            <Input
              id="promo-min-subtotal"
              type="number"
              className="mt-2"
              value={form.minSubtotal}
              onChange={(e) => setForm({ ...form, minSubtotal: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="size-4 rounded border-border"
            />
            {t("promotions.form.isActive")}
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {promotion ? t("common.save") : t("promotions.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
