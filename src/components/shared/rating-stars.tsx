import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            className={cn("size-4", filled ? "fill-primary text-primary" : "text-border")}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}
