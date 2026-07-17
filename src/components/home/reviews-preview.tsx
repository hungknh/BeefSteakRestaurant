import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { RatingStars } from "@/components/shared/rating-stars";
import { getReviews } from "@/lib/data/reviews";

export async function ReviewsPreview() {
  const reviews = await getReviews();
  const top = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Khách hàng nói gì" title="Review Từ Thực Khách" />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {top.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
              <Quote className="size-6 text-primary" strokeWidth={1.5} />
              <RatingStars rating={review.rating} />
              <p className="line-clamp-3 text-sm text-muted-foreground">{review.content}</p>
              <p className="mt-auto text-sm font-medium text-foreground">
                {review.user?.name ?? "Khách hàng"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
