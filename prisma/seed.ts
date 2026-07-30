import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { bestPromotion, type CartLine } from "../src/lib/promotions/apply";
import type { Dish, Doneness, Promotion } from "../src/types";
import { CATEGORIES, DISHES, PROMOTIONS } from "./seed-data/menu";
import { DISH_EN, PROMOTION_EN } from "./seed-data/menu-en";
import { generateCustomers } from "./seed-data/names";
import { generateReviewContent } from "./seed-data/review-text";
import { dayMultiplier, eachDay, isRomanticWindow, WINDOW_START } from "./seed-data/calendar";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const rng = Math.random;
const rint = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function weightedPick<T>(items: readonly T[], weights: readonly number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

const NOW = new Date();

const DELIVERY_ADDRESSES = [
  "12 Nguyễn Huệ, Quận 1, TP.HCM",
  "45 Lê Lợi, Quận 1, TP.HCM",
  "8 Đồng Khởi, Quận 1, TP.HCM",
  "20 Pasteur, Quận 3, TP.HCM",
  "5 Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM",
  "112 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
  "78 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
  "34 Trần Não, TP. Thủ Đức, TP.HCM",
  "9 Tôn Đức Thắng, Quận 1, TP.HCM",
  "56 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP.HCM",
  "21 Phan Xích Long, Quận Phú Nhuận, TP.HCM",
  "67 Cách Mạng Tháng Tám, Quận 3, TP.HCM",
];

const RESERVATION_NOTES = [
  "Kỷ niệm ngày cưới",
  "Cần bàn gần cửa sổ",
  "Sinh nhật, có mang bánh kem",
  "Đi cùng đối tác công ty",
  "Cần ghế cho trẻ nhỏ",
  "Bàn yên tĩnh, ít ồn",
];

const ORDER_ITEM_NOTES = ["Không hành", "Ít cay", "Sốt riêng", "Không sốt", "Nướng kỹ hơn bình thường"];

const DONENESS_OPTIONS: readonly Doneness[] = [
  "MEDIUM_RARE",
  "MEDIUM",
  "RARE",
  "MEDIUM_WELL",
  "WELL_DONE",
];
const DONENESS_WEIGHTS = [35, 25, 15, 15, 10];

function randomTimeOnDay(day: Date, hourRanges: [number, number][]): Date {
  const [startHour, endHour] = pick(hourRanges);
  const hour = rint(startHour, endHour);
  const minute = pick([0, 10, 15, 20, 30, 40, 45, 50]);
  const dt = new Date(day);
  dt.setHours(hour, minute, rint(0, 59), 0);
  return dt;
}

async function main() {
  console.log("Seeding menu (categories/dishes/promotions)...");
  for (const c of CATEGORIES) {
    await prisma.category.create({ data: c });
  }
  for (const d of DISHES) {
    // Bản dịch tiếng Anh nằm trong menu-en.ts, gộp vào lúc ghi (xem ghi chú ở file đó).
    await prisma.dish.create({
      data: { ...d, ...DISH_EN[d.id], avgRating: 0, reviewCount: 0 },
    });
  }
  for (const p of PROMOTIONS) {
    await prisma.promotion.create({ data: { ...p, ...PROMOTION_EN[p.id] } });
  }

  console.log("Seeding users...");
  const demoPasswordHash = await bcrypt.hash("password123", 10);
  const customerCount = 70;
  const customers = generateCustomers(customerCount, rng);
  const customerIds: string[] = [];

  for (const c of customers) {
    const id = `user-${randomUUID()}`;
    customerIds.push(id);
    await prisma.user.create({
      data: { id, name: c.name, email: c.email, role: "USER", password: demoPasswordHash },
    });
  }
  // 15 khách "thân thiết" (mua/đặt bàn thường xuyên hơn) — để "khách mua nhiều nhất" có ý nghĩa.
  const vipCustomerIds = customerIds.slice(0, 15);

  await prisma.user.create({
    data: {
      id: "user-admin-demo",
      name: "Quản Trị Viên",
      email: "admin@beefhaven.vn",
      role: "ADMIN",
      password: await bcrypt.hash("admin1234", 10),
    },
  });

  const activePromotions = PROMOTIONS.filter((p) => p.isActive) as unknown as Promotion[];
  const dishesById = new Map(DISHES.map((d) => [d.id, d as unknown as Dish]));
  const featuredDishIds = DISHES.filter((d) => d.isFeatured).map((d) => d.id);
  const allDishIds = DISHES.map((d) => d.id);
  const days = eachDay(WINDOW_START, NOW);

  console.log(`Generating orders/reservations/reviews across ${days.length} days...`);

  let totalOrders = 0;
  let totalReservations = 0;
  const reviewsToCreate: {
    dishId: string;
    userId: string;
    rating: number;
    content: string;
    createdAt: string;
  }[] = [];
  const reviewedPairs = new Set<string>();

  for (const day of days) {
    const multiplier = dayMultiplier(day);
    const daysAgo = Math.round((NOW.getTime() - day.getTime()) / 86_400_000);
    const isRecent = daysAgo <= 2; // đơn/đặt bàn "đang diễn ra" — chưa xong xuôi

    // ---------- Orders ----------
    const expectedOrders = 0.85 * multiplier;
    const orderCount = Math.round(expectedOrders * (0.7 + rng() * 0.6));
    for (let i = 0; i < orderCount; i++) {
      totalOrders += 1;
      const createdAt = randomTimeOnDay(day, [
        [11, 13],
        [17, 21],
      ]);

      const useVip = rng() < 0.35;
      const useGuest = rng() < 0.35;
      const customerId = useGuest ? null : useVip ? pick(vipCustomerIds) : pick(customerIds);
      const customerIdx = customerId ? customerIds.indexOf(customerId) : -1;
      const customer = customerIdx >= 0 ? customers[customerIdx] : pick(customers);

      const lineCount = rint(1, 4);
      const chosenDishIds = new Set<string>();
      while (chosenDishIds.size < lineCount) {
        chosenDishIds.add(rng() < 0.6 ? pick(featuredDishIds) : pick(allDishIds));
      }

      const lines: CartLine[] = [...chosenDishIds].map((dishId) => ({
        dish: dishesById.get(dishId)!,
        quantity: rint(1, 3),
      }));

      const subtotal = lines.reduce((s, l) => s + l.dish.price * l.quantity, 0);
      const promoResult = bestPromotion(lines, activePromotions, createdAt);
      const discount = promoResult?.discount ?? 0;
      const isDelivery = rng() < 0.7;
      const shippingFee = isDelivery ? 30000 : 0;
      const total = subtotal - discount + shippingFee;

      const isoDate = createdAt.toISOString().slice(0, 10);
      const code = `BS-${isoDate.replace(/-/g, "")}-${String(i + 1).padStart(3, "0")}`;

      let status: string;
      if (isRecent) {
        status = weightedPick(
          ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING"],
          [25, 25, 25, 25],
        );
      } else {
        status = weightedPick(["COMPLETED", "CANCELLED"], [92, 8]);
      }

      await prisma.order.create({
        data: {
          id: `order-${randomUUID()}`,
          code,
          userId: customerId,
          status,
          subtotal,
          discount,
          shippingFee,
          total,
          appliedPromotionId: promoResult?.promotion.id ?? null,
          appliedPromotionTitle: promoResult?.promotion.title ?? null,
          receiverName: customer.name,
          receiverPhone: customer.phone,
          address: isDelivery ? pick(DELIVERY_ADDRESSES) : "Lấy tại quầy",
          createdAt: createdAt.toISOString(),
          items: {
            create: lines.map((line) => {
              const hasDoneness = dishesById.get(line.dish.id)!.hasDoneness;
              return {
                id: `orderitem-${randomUUID()}`,
                dishId: line.dish.id,
                quantity: line.quantity,
                unitPrice: line.dish.price,
                doneness: hasDoneness ? weightedPick(DONENESS_OPTIONS, DONENESS_WEIGHTS) : null,
                note: rng() < 0.12 ? pick(ORDER_ITEM_NOTES) : null,
              };
            }),
          },
        },
      });

      // Đơn đã hoàn thành thì có xác suất khách để lại review cho 1 món trong đơn.
      if (status === "COMPLETED" && customerId && rng() < 0.3) {
        const line = pick(lines);
        const pairKey = `${customerId}:${line.dish.id}`;
        if (!reviewedPairs.has(pairKey)) {
          reviewedPairs.add(pairKey);
          const rating = Number(
            weightedPick(["5", "4", "3", "2", "1"], [55, 27, 12, 4, 2]),
          );
          const reviewDate = new Date(createdAt.getTime() + rint(1, 4) * 86_400_000);
          if (reviewDate <= NOW) {
            reviewsToCreate.push({
              dishId: line.dish.id,
              userId: customerId,
              rating,
              content: generateReviewContent(rating, line.dish.name, rng),
              createdAt: reviewDate.toISOString(),
            });
          }
        }
      }
    }

    // ---------- Reservations ----------
    const expectedReservations = 0.65 * multiplier;
    const reservationCount = Math.round(expectedReservations * (0.7 + rng() * 0.6));
    for (let i = 0; i < reservationCount; i++) {
      totalReservations += 1;
      const useGuest = rng() < 0.4;
      const customerId = useGuest ? null : pick(customerIds);
      const customerIdx = customerId ? customerIds.indexOf(customerId) : -1;
      const customer = customerIdx >= 0 ? customers[customerIdx] : pick(customers);

      const leadDays = rint(0, 12);
      const createdAt = new Date(day.getTime() - leadDays * 86_400_000);
      if (createdAt < WINDOW_START) continue;

      const romantic = isRomanticWindow(day) && rng() < 0.4;
      const promotionId = romantic ? "promo-lang-man" : null;

      let status: string;
      if (isRecent) {
        status = weightedPick(["PENDING", "CONFIRMED"], [50, 50]);
      } else {
        status = weightedPick(["SEATED", "CANCELLED", "NO_SHOW", "CONFIRMED"], [82, 10, 5, 3]);
      }

      await prisma.reservation.create({
        data: {
          id: `res-${randomUUID()}`,
          userId: customerId,
          promotionId,
          guestName: customer.name,
          guestPhone: customer.phone,
          guestEmail: rng() < 0.5 ? customer.email : "",
          date: day.toISOString().slice(0, 10),
          timeSlot: weightedPick(
            ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
            [4, 5, 7, 8, 12, 14, 12, 10, 6, 4],
          ),
          partySize: weightedPick([2, 3, 4, 5, 6, 8], [40, 20, 20, 10, 7, 3]),
          note: rng() < 0.25 ? pick(RESERVATION_NOTES) : null,
          status,
          createdAt: createdAt.toISOString(),
        },
      });
    }
  }

  // Top-up vài đơn "đang diễn ra" cho hôm nay — nếu chỉ để ngẫu nhiên tự nhiên thì
  // có ngày cả 4 trạng thái active (PENDING/CONFIRMED/PREPARING/DELIVERING) không
  // đủ mẫu để xuất hiện hết, biểu đồ trạng thái nhìn thiếu. Đảm bảo mỗi trạng thái
  // có ít nhất vài đơn để demo/chart phản ánh đúng luồng vận hành thật.
  console.log("Top-up đơn đang diễn ra hôm nay...");
  const liveStatuses = ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING"] as const;
  for (const status of liveStatuses) {
    const liveCount = rint(3, 6);
    for (let i = 0; i < liveCount; i++) {
      totalOrders += 1;
      const createdAt = randomTimeOnDay(NOW, [[11, 13], [17, 21]]);
      const useVip = rng() < 0.35;
      const customerId = rng() < 0.65 ? (useVip ? pick(vipCustomerIds) : pick(customerIds)) : null;
      const customerIdx = customerId ? customerIds.indexOf(customerId) : -1;
      const customer = customerIdx >= 0 ? customers[customerIdx] : pick(customers);

      const lineCount = rint(1, 4);
      const chosenDishIds = new Set<string>();
      while (chosenDishIds.size < lineCount) {
        chosenDishIds.add(rng() < 0.6 ? pick(featuredDishIds) : pick(allDishIds));
      }
      const lines: CartLine[] = [...chosenDishIds].map((dishId) => ({
        dish: dishesById.get(dishId)!,
        quantity: rint(1, 3),
      }));

      const subtotal = lines.reduce((s, l) => s + l.dish.price * l.quantity, 0);
      const promoResult = bestPromotion(lines, activePromotions, createdAt);
      const discount = promoResult?.discount ?? 0;
      const isDelivery = rng() < 0.7;
      const shippingFee = isDelivery ? 30000 : 0;
      const total = subtotal - discount + shippingFee;
      const isoDate = createdAt.toISOString().slice(0, 10);
      const code = `BS-${isoDate.replace(/-/g, "")}-live-${status.slice(0, 3)}${i + 1}`;

      await prisma.order.create({
        data: {
          id: `order-${randomUUID()}`,
          code,
          userId: customerId,
          status,
          subtotal,
          discount,
          shippingFee,
          total,
          appliedPromotionId: promoResult?.promotion.id ?? null,
          appliedPromotionTitle: promoResult?.promotion.title ?? null,
          receiverName: customer.name,
          receiverPhone: customer.phone,
          address: isDelivery ? pick(DELIVERY_ADDRESSES) : "Lấy tại quầy",
          createdAt: createdAt.toISOString(),
          items: {
            create: lines.map((line) => {
              const hasDoneness = dishesById.get(line.dish.id)!.hasDoneness;
              return {
                id: `orderitem-${randomUUID()}`,
                dishId: line.dish.id,
                quantity: line.quantity,
                unitPrice: line.dish.price,
                doneness: hasDoneness ? weightedPick(DONENESS_OPTIONS, DONENESS_WEIGHTS) : null,
                note: rng() < 0.12 ? pick(ORDER_ITEM_NOTES) : null,
              };
            }),
          },
        },
      });
    }
  }

  console.log(`Seeding ${reviewsToCreate.length} reviews...`);
  for (const r of reviewsToCreate) {
    await prisma.review.create({
      data: { id: `review-${randomUUID()}`, ...r },
    });
  }

  console.log("Recomputing avgRating/reviewCount per dish...");
  for (const dishId of allDishIds) {
    const agg = await prisma.review.aggregate({
      where: { dishId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.dish.update({
      where: { id: dishId },
      data: {
        avgRating: agg._avg.rating ?? 0,
        reviewCount: agg._count.rating,
      },
    });
  }

  console.log(
    `Done. ${totalOrders} orders, ${totalReservations} reservations, ${reviewsToCreate.length} reviews, ${customerCount + 1} users.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
