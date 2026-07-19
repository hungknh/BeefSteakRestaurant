"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/shared/price";
import { useCartStore, type CartItem } from "@/store/cart";
import { DONENESS_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-4">
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md",
          compact ? "size-16" : "size-24",
        )}
      >
        <Image src={item.dish.imageUrl} alt={item.dish.name} fill sizes="96px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-serif text-foreground">{item.dish.name}</p>
          <Price amount={item.dish.price * item.quantity} className="shrink-0 text-sm" />
        </div>
        {item.doneness ? (
          <p className="text-xs text-muted-foreground">Độ chín: {DONENESS_LABELS[item.doneness]}</p>
        ) : null}
        {item.note ? <p className="text-xs text-muted-foreground">Ghi chú: {item.note}</p> : null}
        <div className="mt-1 flex items-center gap-2">
          <Button
            type="button"
            variant="gold-outline"
            size="icon-sm"
            aria-label="Giảm số lượng"
            onClick={() => updateQuantity(item.key, item.quantity - 1)}
          >
            <Minus className="size-3.5" strokeWidth={1.5} />
          </Button>
          <span className="w-6 text-center text-sm text-foreground">{item.quantity}</span>
          <Button
            type="button"
            variant="gold-outline"
            size="icon-sm"
            aria-label="Tăng số lượng"
            onClick={() => updateQuantity(item.key, item.quantity + 1)}
          >
            <Plus className="size-3.5" strokeWidth={1.5} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Xóa món"
            className="ml-auto text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.key)}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
