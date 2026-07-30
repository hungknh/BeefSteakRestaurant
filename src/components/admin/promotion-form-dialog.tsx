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
import { cn } from "@/lib/utils";
import { createPromotion, updatePromotion } from "@/lib/actions/promotion";
import type { PromotionFormValues } from "@/lib/validations/promotion";
import type { Category, Dish, Promotion } from "@/types";

const DISCOUNT_TYPE_LABELS: Record<Promotion["discountType"], string> = {
  PERCENT: "Phần trăm (%)",
  FIXED: "Số tiền cố định",
  NONE: "Không giảm giá",
};

const SCOPE_LABELS: Record<Promotion["scope"], string> = {
  ALL: "Toàn bộ thực đơn",
  CATEGORY: "Theo danh mục",
  DISH: "Theo món ăn",
};

const DAY_OPTIONS = [
  { value: "1", label: "T2" },
  { value: "2", label: "T3" },
  { value: "3", label: "T4" },
  { value: "4", label: "T5" },
  { value: "5", label: "T6" },
  { value: "6", label: "T7" },
  { value: "0", label: "CN" },
];

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
            {promotion ? "Sửa Khuyến Mãi" : "Thêm Khuyến Mãi"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
          <div>
            <Label htmlFor="promo-title">Tiêu đề</Label>
            <Input
              id="promo-title"
              className="mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="promo-description">Mô tả</Label>
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
              Bản tiếng Anh — để trống ô nào thì ô đó hiện nội dung tiếng Việt
            </p>
            <div>
              <Label htmlFor="promo-title-en">Tiêu đề (tiếng Anh)</Label>
              <Input
                id="promo-title-en"
                className="mt-2"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="promo-description-en">Mô tả (tiếng Anh)</Label>
              <Textarea
                id="promo-description-en"
                className="mt-2"
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promo-badge-label-en">Nhãn badge (EN)</Label>
                <Input
                  id="promo-badge-label-en"
                  className="mt-2"
                  placeholder="VD: DAILY"
                  value={form.badgeLabelEn}
                  onChange={(e) => setForm({ ...form, badgeLabelEn: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="promo-badge-offer-en">Ưu đãi (EN)</Label>
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
              <Label htmlFor="promo-schedule-text-en">Lịch áp dụng (EN)</Label>
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
            <Label htmlFor="promo-image">Ảnh (URL)</Label>
            <Input
              id="promo-image"
              className="mt-2"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-badge-label">Nhãn badge</Label>
              <Input
                id="promo-badge-label"
                className="mt-2"
                placeholder="VD: HÀNG NGÀY"
                value={form.badgeLabel}
                onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="promo-badge-offer">Nội dung ưu đãi</Label>
              <Input
                id="promo-badge-offer"
                className="mt-2"
                placeholder="VD: GIẢM 30%"
                value={form.badgeOffer}
                onChange={(e) => setForm({ ...form, badgeOffer: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="promo-schedule-text">Lịch áp dụng (hiển thị cho khách)</Label>
            <Input
              id="promo-schedule-text"
              className="mt-2"
              placeholder="VD: THỨ 5 HÀNG TUẦN"
              value={form.scheduleText}
              onChange={(e) => setForm({ ...form, scheduleText: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-discount-type">Loại giảm giá</Label>
              <Select
                value={form.discountType}
                onValueChange={(v) =>
                  setForm({ ...form, discountType: (v ?? "PERCENT") as Promotion["discountType"] })
                }
              >
                <SelectTrigger id="promo-discount-type" className="mt-2 w-full">
                  <SelectValue>
                    {(value: Promotion["discountType"]) => DISCOUNT_TYPE_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENT">Phần trăm (%)</SelectItem>
                  <SelectItem value="FIXED">Số tiền cố định</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="promo-discount-value">Giá trị giảm</Label>
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
            <Label htmlFor="promo-scope">Phạm vi áp dụng</Label>
            <Select
              value={form.scope}
              onValueChange={(v) =>
                setForm({ ...form, scope: (v ?? "ALL") as Promotion["scope"] })
              }
            >
              <SelectTrigger id="promo-scope" className="mt-2 w-full">
                <SelectValue>{(value: Promotion["scope"]) => SCOPE_LABELS[value]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toàn bộ thực đơn</SelectItem>
                <SelectItem value="CATEGORY">Theo danh mục</SelectItem>
                <SelectItem value="DISH">Theo món ăn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.scope === "CATEGORY" ? (
            <div>
              <Label htmlFor="promo-category">Danh mục áp dụng</Label>
              <Select
                value={form.targetCategoryId ?? ""}
                onValueChange={(v) => setForm({ ...form, targetCategoryId: v ?? null })}
              >
                <SelectTrigger id="promo-category" className="mt-2 w-full">
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
          ) : null}
          {form.scope === "DISH" ? (
            <div>
              <Label htmlFor="promo-dish">Món áp dụng</Label>
              <Select
                value={form.targetDishId ?? ""}
                onValueChange={(v) => setForm({ ...form, targetDishId: v ?? null })}
              >
                <SelectTrigger id="promo-dish" className="mt-2 w-full">
                  <SelectValue placeholder="Chọn món">
                    {(value: string) => dishes.find((d) => d.id === value)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {dishes.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div>
            <Label>Ngày trong tuần (bỏ trống = mọi ngày)</Label>
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
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-start-time">Giờ bắt đầu</Label>
              <Input
                id="promo-start-time"
                type="time"
                className="mt-2"
                value={form.startTime ?? ""}
                onChange={(e) => setForm({ ...form, startTime: e.target.value || null })}
              />
            </div>
            <div>
              <Label htmlFor="promo-end-time">Giờ kết thúc</Label>
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
              <Label htmlFor="promo-start-date">Ngày bắt đầu (tùy chọn)</Label>
              <Input
                id="promo-start-date"
                type="date"
                className="mt-2"
                value={form.startDate ?? ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value || null })}
              />
            </div>
            <div>
              <Label htmlFor="promo-end-date">Ngày kết thúc (tùy chọn)</Label>
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
            <Label htmlFor="promo-min-subtotal">Hóa đơn tối thiểu (VNĐ)</Label>
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
            Đang kích hoạt
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {promotion ? "Lưu Thay Đổi" : "Thêm Khuyến Mãi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
