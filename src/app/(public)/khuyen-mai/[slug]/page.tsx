import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDaysOfWeek, formatVND } from "@/lib/format";
import { getPromotionBySlug } from "@/lib/data/promotions";
import { getCategories } from "@/lib/data/categories";
import { getDishes } from "@/lib/data/dishes";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const promo = await getPromotionBySlug(slug);
  if (!promo) return {};
  return { title: promo.title, description: promo.description };
}

export default async function PromotionDetailPage({ params }: Props) {
  const { slug } = await params;
  const promo = await getPromotionBySlug(slug);
  if (!promo) notFound();

  let scopeText = "Áp dụng cho toàn bộ thực đơn.";
  if (promo.scope === "CATEGORY" && promo.targetCategoryId) {
    const categories = await getCategories();
    const category = categories.find((c) => c.id === promo.targetCategoryId);
    scopeText = category ? `Áp dụng cho danh mục ${category.name}.` : scopeText;
  } else if (promo.scope === "DISH" && promo.targetDishId) {
    const dishes = await getDishes();
    const dish = dishes.find((d) => d.id === promo.targetDishId);
    scopeText = dish ? `Áp dụng cho món ${dish.name}.` : scopeText;
  }

  const discountText =
    promo.discountType === "PERCENT"
      ? `Giảm ${promo.discountValue}% giá trị đơn`
      : promo.discountType === "FIXED"
        ? `Giảm ${formatVND(promo.discountValue)}`
        : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={promo.imageUrl}
          alt={promo.title}
          fill
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-badge-label px-3 py-1 text-xs font-medium text-foreground uppercase tracking-wider">
          {promo.badgeLabel}
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-badge-offer px-3 py-1 text-xs font-medium text-primary-foreground uppercase tracking-wider">
          {promo.badgeOffer}
        </span>
      </div>

      <h1 className="mt-8 font-serif text-3xl text-foreground sm:text-4xl">{promo.title}</h1>
      <p className="mt-3 text-muted-foreground">{promo.description}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">Thời gian áp dụng</p>
            <p className="mt-1 text-sm text-muted-foreground">{promo.scheduleText}</p>
            <p className="text-sm text-muted-foreground">{formatDaysOfWeek(promo.daysOfWeek)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Wallet className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-foreground">Điều kiện áp dụng</p>
            <p className="mt-1 text-sm text-muted-foreground">{scopeText}</p>
            {promo.minSubtotal > 0 ? (
              <p className="text-sm text-muted-foreground">
                Cho hóa đơn từ {formatVND(promo.minSubtotal)}
              </p>
            ) : null}
            {discountText ? <p className="text-sm text-muted-foreground">{discountText}</p> : null}
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="mt-10"
        nativeButton={false}
        render={<Link href={`/dat-ban?promo=${promo.slug}`} />}
      >
        Đặt Bàn Với Ưu Đãi Này
      </Button>
    </div>
  );
}
