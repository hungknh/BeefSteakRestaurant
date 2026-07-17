"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { Doneness } from "@/types";

const DONENESS_OPTIONS: { value: Doneness; label: string }[] = [
  { value: "RARE", label: "Tái" },
  { value: "MEDIUM_RARE", label: "Tái Chín" },
  { value: "MEDIUM", label: "Chín Vừa" },
  { value: "MEDIUM_WELL", label: "Chín Vừa Kỹ" },
  { value: "WELL_DONE", label: "Chín Kỹ" },
];

export function OrderPanel({ hasDoneness }: { hasDoneness: boolean }) {
  const [doneness, setDoneness] = useState<Doneness>("MEDIUM_RARE");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      {hasDoneness ? (
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

      {/* ponytail: chưa nối Zustand cart store, xem PLAN.md Giai đoạn 5 */}
      <Button size="lg" type="button">
        Thêm Vào Giỏ
      </Button>
    </div>
  );
}
