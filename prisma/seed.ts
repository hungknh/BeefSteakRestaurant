import bcrypt from "bcryptjs";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  MOCK_CATEGORIES,
  MOCK_DISHES,
  MOCK_ORDERS,
  MOCK_PROMOTIONS,
  MOCK_RESERVATIONS,
  MOCK_REVIEWS,
  MOCK_USERS,
} from "../src/lib/data/_mock";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

// ponytail: seed dùng create() thô, không upsert — script này chỉ chạy trên DB mới
// (sau `prisma migrate reset`/`migrate dev`), không cần idempotent.
async function main() {
  for (const c of MOCK_CATEGORIES) {
    await prisma.category.create({
      data: { id: c.id, name: c.name, slug: c.slug, sortOrder: c.sortOrder },
    });
  }

  for (const d of MOCK_DISHES) {
    await prisma.dish.create({
      data: {
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        price: d.price,
        imageUrl: d.imageUrl,
        categoryId: d.categoryId,
        isAvailable: d.isAvailable,
        isFeatured: d.isFeatured,
        weightGram: d.weightGram,
        hasDoneness: d.hasDoneness,
        avgRating: d.avgRating,
        reviewCount: d.reviewCount,
      },
    });
  }

  for (const p of MOCK_PROMOTIONS) {
    await prisma.promotion.create({
      data: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        imageUrl: p.imageUrl,
        badgeLabel: p.badgeLabel,
        badgeOffer: p.badgeOffer,
        scheduleText: p.scheduleText,
        discountType: p.discountType,
        discountValue: p.discountValue,
        scope: p.scope,
        targetCategoryId: p.targetCategoryId,
        targetDishId: p.targetDishId,
        daysOfWeek: p.daysOfWeek,
        startTime: p.startTime,
        endTime: p.endTime,
        minSubtotal: p.minSubtotal,
        startDate: p.startDate,
        endDate: p.endDate,
        isActive: p.isActive,
        sortOrder: p.sortOrder,
      },
    });
  }

  // Mật khẩu demo dùng chung cho toàn bộ tài khoản seed — chỉ cho môi trường dev/demo,
  // không dùng cho user thật (Giai đoạn 9+ đăng ký qua form sẽ tự hash mật khẩu riêng).
  const demoPasswordHash = await bcrypt.hash("password123", 10);

  for (const u of MOCK_USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        password: demoPasswordHash,
      },
    });
  }

  // Tài khoản admin demo — không có trong MOCK_USERS (type `User` dùng cho UI khách hàng,
  // không nên lẫn tài khoản quản trị vào đó). Dùng để đăng nhập /admin.
  await prisma.user.create({
    data: {
      id: "user-admin-demo",
      name: "Quản Trị Viên",
      email: "admin@beefhaven.vn",
      role: "ADMIN",
      password: await bcrypt.hash("admin1234", 10),
    },
  });

  for (const r of MOCK_REVIEWS) {
    await prisma.review.create({
      data: {
        id: r.id,
        dishId: r.dishId,
        userId: r.userId,
        rating: r.rating,
        content: r.content,
        createdAt: r.createdAt,
      },
    });
  }

  for (const res of MOCK_RESERVATIONS) {
    await prisma.reservation.create({
      data: {
        id: res.id,
        userId: res.userId,
        promotionId: res.promotionId,
        guestName: res.guestName,
        guestPhone: res.guestPhone,
        guestEmail: res.guestEmail,
        date: res.date,
        timeSlot: res.timeSlot,
        partySize: res.partySize,
        note: res.note,
        status: res.status,
        createdAt: res.createdAt,
      },
    });
  }

  for (const o of MOCK_ORDERS) {
    await prisma.order.create({
      data: {
        id: o.id,
        code: o.code,
        userId: o.userId,
        status: o.status,
        subtotal: o.subtotal,
        discount: o.discount,
        shippingFee: o.shippingFee,
        total: o.total,
        appliedPromotionId: o.appliedPromotionId,
        appliedPromotionTitle: o.appliedPromotionTitle,
        receiverName: o.receiverName,
        receiverPhone: o.receiverPhone,
        address: o.address,
        createdAt: o.createdAt,
        items: {
          create: o.items.map((i) => ({
            id: i.id,
            dishId: i.dishId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            doneness: i.doneness,
            note: i.note,
          })),
        },
      },
    });
  }

  console.log(
    `Seeded ${MOCK_CATEGORIES.length} categories, ${MOCK_DISHES.length} dishes, ${MOCK_PROMOTIONS.length} promotions, ${MOCK_USERS.length} users, ${MOCK_REVIEWS.length} reviews, ${MOCK_RESERVATIONS.length} reservations, ${MOCK_ORDERS.length} orders.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
