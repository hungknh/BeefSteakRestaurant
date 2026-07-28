"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`${star} sao`}
            disabled={disabled}
            onClick={() => onChange(star)}
            className="rounded-sm p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
          >
            <Star
              className={cn("size-6", filled ? "fill-primary text-primary" : "text-border")}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
