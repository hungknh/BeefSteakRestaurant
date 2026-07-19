import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Weight } from "lucide-react";
import { Price } from "@/components/shared/price";
import { OrderPanel } from "@/components/menu/order-panel";
import { DishCard } from "@/components/menu/dish-card";
import { ReviewList } from "@/components/review/review-list";
import { getDishBySlug, getDishes } from "@/lib/data/dishes";
import { getReviews } from "@/lib/data/reviews";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dish = await getDishBySlug(slug);
  if (!dish) return {};
  return { title: dish.name, description: dish.description };
}

export default async function DishDetailPage({ params }: Props) {
  const { slug } = await params;
  const dish = await getDishBySlug(slug);
  if (!dish) notFound();

  const [reviews, sameCategoryDishes] = await Promise.all([
    getReviews({ dishId: dish.id }),
    getDishes({ category: dish.category?.slug }),
  ]);
  const related = sameCategoryDishes.filter((d) => d.id !== dish.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg lg:aspect-square">
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-serif text-3xl text-foreground sm:text-4xl">{dish.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <Price amount={dish.price} className="text-2xl" />
              {dish.weightGram ? (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Weight className="size-4" strokeWidth={1.5} />
                  {dish.weightGram}g
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-muted-foreground">{dish.description}</p>
          </div>

          <OrderPanel dish={dish} />
        </div>
      </div>

      <div className="mt-20 border-t border-border pt-16">
        <h2 className="font-serif text-2xl text-foreground">Đánh Giá Từ Thực Khách</h2>
        <div className="mt-8">
          <ReviewList reviews={reviews} avgRating={dish.avgRating} />
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-20 border-t border-border pt-16">
          <h2 className="font-serif text-2xl text-foreground">Món Liên Quan</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {related.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
