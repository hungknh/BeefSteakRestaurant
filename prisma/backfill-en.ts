/**
 * Điền bản dịch tiếng Anh cho dữ liệu ĐANG CÓ trên DB (Giai đoạn 15).
 *
 * Chạy: `npx tsx prisma/backfill-en.ts`
 *
 * Vì sao cần script này thay vì seed lại: DB thật đang chứa 632 đơn hàng + 457 đặt bàn +
 * 113 đánh giá của bản demo. `prisma db seed` xoá sạch và sinh lại (mất hết), lại còn bị
 * Prisma chặn khi chạy từ AI agent (PROGRESS.md #35). Script này CHỈ ghi các cột `*En`.
 *
 * An toàn để chạy lại nhiều lần (idempotent): mỗi lần đều ghi cùng giá trị từ menu-en.ts,
 * không đọc trạng thái cũ, không xoá gì. Bản ghi có id không nằm trong menu-en.ts thì bỏ
 * qua và báo ra cuối — không ghi rỗng lên.
 */
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { CATEGORIES } from "./seed-data/menu";
import { DISH_EN, PROMOTION_EN } from "./seed-data/menu-en";

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: process.env.DIRECT_URL })),
});

async function main() {
  let categories = 0;
  for (const c of CATEGORIES) {
    if (!c.nameEn) continue;
    const { count } = await prisma.category.updateMany({
      where: { id: c.id },
      data: { nameEn: c.nameEn },
    });
    categories += count;
  }

  let dishes = 0;
  for (const [id, en] of Object.entries(DISH_EN)) {
    const { count } = await prisma.dish.updateMany({ where: { id }, data: en });
    dishes += count;
  }

  let promotions = 0;
  for (const [id, en] of Object.entries(PROMOTION_EN)) {
    const { count } = await prisma.promotion.updateMany({ where: { id }, data: en });
    promotions += count;
  }

  console.log(`Đã điền: ${categories} danh mục, ${dishes} món, ${promotions} khuyến mãi.`);

  // Báo bản ghi trong DB chưa có bản dịch — thường là món admin tự tạo sau khi seed.
  // UI tự rơi về tiếng Việt nên không vỡ, nhưng cần biết để dịch thủ công qua admin.
  const dishThieu = await prisma.dish.findMany({
    where: { nameEn: null },
    select: { id: true, name: true },
  });
  const promoThieu = await prisma.promotion.findMany({
    where: { titleEn: null },
    select: { id: true, title: true },
  });

  if (dishThieu.length || promoThieu.length) {
    console.log("\nChưa có bản dịch (UI sẽ hiện tiếng Việt), dịch qua trang admin:");
    for (const d of dishThieu) console.log(`  món       ${d.id} — ${d.name}`);
    for (const p of promoThieu) console.log(`  khuyến mãi ${p.id} — ${p.title}`);
  } else {
    console.log("Mọi món và khuyến mãi trong DB đều đã có bản dịch.");
  }
}

main().finally(() => prisma.$disconnect());
