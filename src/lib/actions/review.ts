"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations/review";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("Errors");
  const parsed = reviewFormSchema.safeParse(values);
  if (!parsed.success) return { error: t("invalidData") };

  const session = await auth();
  if (!session?.user?.id) return { error: t("signInToReview") };
  const userId = session.user.id;

  const purchased = await prisma.orderItem.findFirst({
    where: { dishId, order: { userId, status: "COMPLETED" } },
    select: { id: true },
  });
  if (!purchased) {
    return { error: t("mustPurchaseFirst") };
  }

  const existing = await prisma.review.findUnique({
    where: { userId_dishId: { userId, dishId } },
  });
  if (existing) return { error: t("alreadyReviewed") };

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
  const t = await getTranslations("Errors");
  const parsed = reviewFormSchema.safeParse(values);
  if (!parsed.success) return { error: t("invalidData") };

  const session = await auth();
  if (!session?.user?.id) return { error: t("signInRequired") };

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { error: t("reviewNotFound") };
  if (review.userId !== session.user.id) return { error: t("cannotEditReview") };

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
  const t = await getTranslations("Errors");
  const session = await auth();
  if (!session?.user?.id) return { error: t("signInRequired") };

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { error: t("reviewNotFound") };
  if (review.userId !== session.user.id) return { error: t("cannotDeleteReview") };

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await recalcDishRating(tx, review.dishId);
  });

  revalidatePath(`/thuc-don/${slug}`);
  return { success: true as const };
}
