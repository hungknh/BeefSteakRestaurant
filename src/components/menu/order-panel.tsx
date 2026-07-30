"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart";
import { DONENESS_LABELS, donenessLabel } from "@/lib/format";
import type { Dish, Doneness } from "@/types";
import { useLocale, useTranslations } from "next-intl";

// Chỉ giữ danh sách giá trị; nhãn lấy theo locale lúc render (donenessLabel).
const DONENESS_VALUES = Object.keys(DONENESS_LABELS) as Doneness[];

export function OrderPanel({ dish }: { dish: Dish }) {
  const t = useTranslations("OrderPanel");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const [doneness, setDoneness] = useState<Doneness>("MEDIUM_RARE");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(dish, quantity, dish.hasDoneness ? doneness : null, note.trim());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      {dish.hasDoneness ? (
        <div>
          <Label htmlFor="doneness" className="text-sm font-medium text-foreground">
            {t("doneness")}
          </Label>
          <RadioGroup
            id="doneness"
            value={doneness}
            onValueChange={(value) => setDoneness(value as Doneness)}
            className="mt-3"
          >
            {DONENESS_VALUES.map((value) => (
              <label
                key={value}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <RadioGroupItem value={value} />
                {donenessLabel(value, locale)}
              </label>
            ))}
          </RadioGroup>
        </div>
      ) : null}

      <div>
        <Label className="text-sm font-medium text-foreground">{t("quantity")}</Label>
        <div className="mt-3 flex items-center gap-3">
          <Button
            type="button"
            variant="gold-outline"
            size="icon"
            aria-label={t("decrease")}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-4" strokeWidth={1.5} />
          </Button>
          <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
          <Button
            type="button"
            variant="gold-outline"
            size="icon"
            aria-label={t("increase")}
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="note" className="text-sm font-medium text-foreground">
          {t("noteOptional")}
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("notePlaceholder")}
          className="mt-3"
        />
      </div>

      <Button size="lg" type="button" onClick={handleAddToCart}>
        {justAdded ? t("added") : t("addToCart")}
      </Button>
    </div>
  );
}
