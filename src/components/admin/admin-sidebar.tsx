"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card sm:block">
      <div className="flex h-16 items-center px-6 font-serif text-lg text-foreground">
        BeefSteak<span className="text-primary">Admin</span>
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
                active && "bg-primary/10 text-primary",
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
