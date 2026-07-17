import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/components/shared/rating-stars";
import { Price } from "@/components/shared/price";
import type { Dish } from "@/types";

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <Link
      href={`/thuc-don/${dish.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {dish.isFeatured ? (
          <span className="absolute top-4 left-4 rounded-full bg-badge-label px-3 py-1 text-xs font-medium text-foreground uppercase tracking-wider">
            Nổi Bật
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg text-foreground">{dish.name}</h3>
          <Price amount={dish.price} className="shrink-0 text-sm" />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>
        {dish.reviewCount > 0 ? (
          <div className="mt-auto flex items-center gap-2 pt-2">
            <RatingStars rating={dish.avgRating} />
            <span className="text-xs text-muted-foreground">({dish.reviewCount})</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
