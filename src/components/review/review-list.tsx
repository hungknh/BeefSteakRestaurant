import { RatingStars } from "@/components/shared/rating-stars";
import type { Review } from "@/types";

export function ReviewList({ reviews, avgRating }: { reviews: Review[]; avgRating: number }) {
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, percent };
  });

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl text-foreground">{avgRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">/ 5</span>
        </div>
        <RatingStars rating={avgRating} />
        <p className="text-sm text-muted-foreground">{reviews.length} đánh giá</p>

        <div className="mt-2 flex flex-col gap-1.5">
          {distribution.map(({ star, count, percent }) => (
            <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3">{star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có đánh giá nào cho món này.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-foreground">
                  {review.user?.name ?? "Khách hàng"}
                </p>
                <RatingStars rating={review.rating} />
              </div>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
