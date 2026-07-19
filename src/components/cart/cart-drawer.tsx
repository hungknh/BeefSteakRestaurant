"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/store/cart";
import type { Promotion } from "@/types";

// persist đọc localStorage sau khi SSR xong -> render thẳng badge sẽ lệch server/client.
// useSyncExternalStore trả false lúc SSR, true sau khi hydrate xong (PLAN.md Giai đoạn 5).
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function CartDrawer({ promos }: { promos: Promotion[] }) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useCartStore((s) => s.items);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Giỏ hàng" className="relative" />}
      >
        <ShoppingCart className="size-5" strokeWidth={1.5} />
        {mounted && count > 0 ? (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {count}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif">Giỏ Hàng Của Bạn</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Giỏ hàng trống.</p>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartLineItem key={item.key} item={item} compact />
              ))}
            </div>
          )}
        </div>
        {items.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-border p-6">
            <CartSummary items={items} promos={promos} />
            <Button variant="gold-outline" nativeButton={false} render={<Link href="/gio-hang" />}>
              Xem Giỏ Hàng
            </Button>
            <Button nativeButton={false} render={<Link href="/thanh-toan" />}>
              Thanh Toán
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
