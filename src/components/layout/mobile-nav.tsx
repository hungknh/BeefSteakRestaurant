"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function MobileNav({ pathname }: { pathname: string }) {
  const t = useTranslations("Header");
  const tNav = useTranslations("Nav");

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="xl:hidden" aria-label={t("openMenu")} />
        }
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="right" className="bg-background">
        <SheetHeader>
          <SheetTitle>{t("menu")}</SheetTitle>
        </SheetHeader>
        <nav className="mt-2 flex flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-3 text-sm font-medium text-muted-foreground uppercase tracking-wider hover:bg-accent hover:text-foreground",
                  active && "text-primary",
                )}
              >
                {tNav(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
