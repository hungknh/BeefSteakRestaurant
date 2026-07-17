import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@/types";

export function PromoCard({ promo }: { promo: Promotion }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={promo.imageUrl}
          alt={promo.title}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-badge-label px-3 py-1 text-xs font-medium text-foreground uppercase tracking-wider">
          {promo.badgeLabel}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-badge-offer px-3 py-1 text-xs font-medium text-primary-foreground uppercase tracking-wider">
          {promo.badgeOffer}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-serif text-xl text-foreground">{promo.title}</h3>
        <p className="text-sm text-muted-foreground">{promo.description}</p>
        <div className="flex items-center gap-2 text-xs text-primary-muted uppercase tracking-wider">
          <CalendarDays className="size-4" strokeWidth={1.5} />
          <span>{promo.scheduleText}</span>
        </div>
        <Button
          variant="gold-outline"
          size="sm"
          className="mt-2 w-fit"
          nativeButton={false}
          render={<Link href={`/khuyen-mai/${promo.slug}`} />}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}
