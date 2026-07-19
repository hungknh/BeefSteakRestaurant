"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartStore } from "@/store/cart";
import type { Promotion } from "@/types";

export function CartPageView({ promos }: { promos: Promotion[] }) {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-border bg-card py-16 text-center">
        <p className="text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
        <Button nativeButton={false} render={<Link href="/thuc-don" />}>
          Xem Thực Đơn
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="divide-y divide-border rounded-lg border border-border bg-card px-5 lg:col-span-2">
        {items.map((item) => (
          <CartLineItem key={item.key} item={item} />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <CartSummary items={items} promos={promos} />
        <Button size="lg" nativeButton={false} render={<Link href="/thanh-toan" />}>
          Tiến Hành Thanh Toán
        </Button>
      </div>
    </div>
  );
}
