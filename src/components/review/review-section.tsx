"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/review/review-form";
import { ReviewList } from "@/components/review/review-list";
import { createReview, deleteReview, updateReview } from "@/lib/actions/review";
import type { ReviewFormValues } from "@/lib/validations/review";
import type { Review, User } from "@/types";

type OptimisticAction =
  | { type: "add"; review: Review }
  | { type: "update"; review: Review }
  | { type: "remove"; id: string };

function reviewsReducer(state: Review[], action: OptimisticAction): Review[] {
  switch (action.type) {
    case "add":
      return [action.review, ...state];
    case "update":
      return state.map((r) => (r.id === action.review.id ? action.review : r));
    case "remove":
      return state.filter((r) => r.id !== action.id);
  }
}

export function ReviewSection({
  dishId,
  slug,
  reviews,
  currentUser,
  canReview,
}: {
  dishId: string;
  slug: string;
  reviews: Review[];
  currentUser: User | null;
  canReview: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
  const [error, setError] = useState<string | null>(null);
  const [optimisticReviews, applyOptimistic] = useOptimistic(reviews, reviewsReducer);

  const myReview = currentUser
    ? optimisticReviews.find((r) => r.userId === currentUser.id)
    : undefined;
  const avgRating =
    optimisticReviews.length > 0
      ? optimisticReviews.reduce((sum, r) => sum + r.rating, 0) / optimisticReviews.length
      : 0;

  function submitCreate(values: ReviewFormValues) {
    if (!currentUser) return;
    setError(null);
    const optimisticReview: Review = {
      id: `optimistic-${optimisticReviews.length}`,
      dishId,
      userId: currentUser.id,
      user: currentUser,
      rating: values.rating,
      content: values.content,
      createdAt: new Date().toISOString(),
    };
    startTransition(async () => {
      applyOptimistic({ type: "add", review: optimisticReview });
      const result = await createReview(dishId, slug, values);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMode("idle");
      router.refresh();
    });
  }

  function submitUpdate(reviewId: string, values: ReviewFormValues) {
    const current = optimisticReviews.find((r) => r.id === reviewId);
    if (!current) return;
    setError(null);
    startTransition(async () => {
      applyOptimistic({ type: "update", review: { ...current, ...values } });
      const result = await updateReview(reviewId, slug, values);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMode("idle");
      router.refresh();
    });
  }

  function submitDelete(reviewId: string) {
    setError(null);
    startTransition(async () => {
      applyOptimistic({ type: "remove", id: reviewId });
      // ponytail: xóa ngay không cần confirm dialog, khớp pattern admin hiện có (dishes-table.tsx)
      const result = await deleteReview(reviewId, slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <ReviewList
        reviews={optimisticReviews}
        avgRating={avgRating}
        currentUserId={currentUser?.id}
        onEdit={() => setMode("edit")}
        onDelete={(review) => submitDelete(review.id)}
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {mode === "edit" && myReview ? (
        <ReviewForm
          defaultValues={{ rating: myReview.rating, content: myReview.content }}
          submitLabel="Lưu Thay Đổi"
          pending={isPending}
          error={null}
          onCancel={() => setMode("idle")}
          onSubmit={(values) => submitUpdate(myReview.id, values)}
        />
      ) : null}

      {mode === "create" && currentUser && canReview && !myReview ? (
        <ReviewForm
          defaultValues={{ rating: 5, content: "" }}
          submitLabel="Gửi Đánh Giá"
          pending={isPending}
          error={null}
          onCancel={() => setMode("idle")}
          onSubmit={submitCreate}
        />
      ) : null}

      {mode === "idle" ? (
        !currentUser ? (
          <p className="text-sm text-muted-foreground">
            <Link href="/dang-nhap" className="text-primary hover:underline">
              Đăng nhập
            </Link>{" "}
            để viết đánh giá.
          </p>
        ) : myReview ? null : canReview ? (
          <Button variant="gold-outline" size="sm" onClick={() => setMode("create")}>
            Viết Đánh Giá
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Bạn cần đặt món này và đơn đã hoàn thành mới có thể đánh giá.
          </p>
        )
      ) : null}
    </div>
  );
}
