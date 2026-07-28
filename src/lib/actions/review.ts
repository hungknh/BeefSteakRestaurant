"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations/review";

async function recalcDishRating(tx: Prisma.TransactionClient, dishId: string) {
  const agg = await tx.review.aggregate({
    where: { dishId },
    _avg: { rating: true },
    _count: true,
  });
  await tx.dish.update({
    where: { id: dishId },
    data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count },
  });
}

export async function createReview(dishId: string, slug: string, values: ReviewFormValues) {
  const parsed = reviewFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await auth();
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập để đánh giá." };
  const userId = session.user.id;

  const purchased = await prisma.orderItem.findFirst({
    where: { dishId, order: { userId, status: "COMPLETED" } },
    select: { id: true },
  });
  if (!purchased) {
    return { error: "Bạn cần đặt món này và đơn đã hoàn thành mới có thể đánh giá." };
  }

  const existing = await prisma.review.findUnique({
    where: { userId_dishId: { userId, dishId } },
  });
  if (existing) return { error: "Bạn đã đánh giá món này rồi." };

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        id: `review-${randomUUID()}`,
        dishId,
        userId,
        rating: parsed.data.rating,
        content: parsed.data.content,
        createdAt: new Date().toISOString(),
      },
    });
    await recalcDishRating(tx, dishId);
  });

  revalidatePath(`/thuc-don/${slug}`);
  return { success: true as const };
}

export async function updateReview(reviewId: string, slug: string, values: ReviewFormValues) {
  const parsed = reviewFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await auth();
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập." };

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Không tìm thấy đánh giá." };
  if (review.userId !== session.user.id) return { error: "Bạn không có quyền sửa đánh giá này." };

  await prisma.$transaction(async (tx) => {
    await tx.review.update({
      where: { id: reviewId },
      data: { rating: parsed.data.rating, content: parsed.data.content },
    });
    await recalcDishRating(tx, review.dishId);
  });

  revalidatePath(`/thuc-don/${slug}`);
  return { success: true as const };
}

export async function deleteReview(reviewId: string, slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập." };

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Không tìm thấy đánh giá." };
  if (review.userId !== session.user.id) return { error: "Bạn không có quyền xóa đánh giá này." };

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await recalcDishRating(tx, review.dishId);
  });

  revalidatePath(`/thuc-don/${slug}`);
  return { success: true as const };
}
