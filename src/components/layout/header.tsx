"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
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
import { CartDrawer } from "@/components/cart/cart-drawer";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/types";

export function Header({ promos }: { promos: Promotion[] }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <TopBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-serif text-xl tracking-wide text-foreground"
        >
          <Image
            src="/images/logo.jpg"
            alt="Beef Haven"
            width={36}
            height={36}
            className="rounded-full"
            priority
            unoptimized
          />
          Beef <span className="text-primary">Haven</span>
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
          <CartDrawer promos={promos} />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" aria-label="Tài khoản" />}
            >
              <User className="size-5" strokeWidth={1.5} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session?.user ? (
                <>
                  <DropdownMenuItem render={<Link href="/tai-khoan" />}>
                    {session.user.name ?? "Tài khoản"}
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" ? (
                    <DropdownMenuItem render={<Link href="/admin" />}>Quản trị</DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    Đăng xuất
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem render={<Link href="/dang-nhap" />}>Đăng nhập</DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dang-ky" />}>Đăng ký</DropdownMenuItem>
                </>
              )}
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
