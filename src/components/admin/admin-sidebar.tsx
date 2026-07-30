"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { LayoutDashboard, UtensilsCrossed, Tag, CalendarCheck, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Tổng Quan", href: "/admin", icon: LayoutDashboard },
  { label: "Món Ăn", href: "/admin/dishes", icon: UtensilsCrossed },
  { label: "Khuyến Mãi", href: "/admin/promotions", icon: Tag },
  { label: "Đặt Bàn", href: "/admin/reservations", icon: CalendarCheck },
  { label: "Đơn Hàng", href: "/admin/orders", icon: ShoppingBag },
] as const;

export function AdminSidebar() {
  // usePathname của next-intl: đã bỏ prefix locale, nên so khớp `active` chạy đúng ở cả
  // `/admin` và `/en/admin`. Dùng bản của next/navigation thì bản tiếng Anh không tô mục nào.
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card sm:block">
      <div className="flex h-16 items-center gap-2 px-6 font-serif text-lg text-foreground">
        <Image
          src="/images/logo.jpg"
          alt="Beef Haven"
          width={28}
          height={28}
          className="rounded-full"
          priority
          unoptimized
        />
        Beef Haven <span className="text-primary">Admin</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {ADMIN_NAV.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground",
                active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
