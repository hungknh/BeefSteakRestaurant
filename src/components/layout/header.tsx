"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <TopBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 font-serif text-xl tracking-wide text-foreground">
          BeefSteak<span className="text-primary">House</span>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground",
                  active &&
                    "text-foreground underline decoration-primary decoration-2 underline-offset-8",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Giỏ hàng"
            nativeButton={false}
            render={<Link href="/gio-hang" />}
          >
            <ShoppingCart className="size-5" strokeWidth={1.5} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" aria-label="Tài khoản" />}
            >
              <User className="size-5" strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href="/dang-nhap" />}>Đăng nhập</DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dang-ky" />}>Đăng ký</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="hidden xl:inline-flex"
            nativeButton={false}
            render={<Link href="/dat-ban" />}
          >
            Đặt Bàn
          </Button>

          <MobileNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
