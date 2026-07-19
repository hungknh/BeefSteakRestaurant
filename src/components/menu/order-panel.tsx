"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cart";
import { DONENESS_LABELS } from "@/lib/format";
import type { Dish, Doneness } from "@/types";

const DONENESS_OPTIONS = (Object.entries(DONENESS_LABELS) as [Doneness, string][]).map(
  ([value, label]) => ({ value, label }),
);

export function OrderPanel({ dish }: { dish: Dish }) {
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
            Độ chín
          </Label>
          <RadioGroup
            id="doneness"
            value={doneness}
            onValueChange={(value) => setDoneness(value as Doneness)}
            className="mt-3"
          >
            {DONENESS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <RadioGroupItem value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </div>
      ) : null}

      <div>
        <Label className="text-sm font-medium text-foreground">Số lượng</Label>
        <div className="mt-3 flex items-center gap-3">
          <Button
            type="button"
            variant="gold-outline"
            size="icon"
            aria-label="Giảm số lượng"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-4" strokeWidth={1.5} />
          </Button>
          <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
          <Button
            type="button"
            variant="gold-outline"
            size="icon"
            aria-label="Tăng số lượng"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="note" className="text-sm font-medium text-foreground">
          Ghi chú (tùy chọn)
        </Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ví dụ: không hành, ít cay..."
          className="mt-3"
        />
      </div>

      <Button size="lg" type="button" onClick={handleAddToCart}>
        {justAdded ? "Đã Thêm Vào Giỏ ✓" : "Thêm Vào Giỏ"}
      </Button>
    </div>
  );
}
