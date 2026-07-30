import { prisma } from "@/lib/prisma";
import type { Review } from "@/types";

/**
 * Đánh giá kèm tên người viết.
 *
 * ⚠️ `select` phải HẸP HẾT MỨC, không chỉ "tránh include: { user: true }".
 *
 * Hai lớp vấn đề đã gặp:
 * 1. `include: { user: true }` trả cả cột `password` (bcrypt hash) — PROGRESS.md #41.
 * 2. `select` liệt kê thừa `email`/`role` vẫn là **rò rỉ dữ liệu cá nhân**: trang món là
 *    trang công khai, mọi field ở đây đi vào RSC payload trong HTML nên ai xem source cũng
 *    đọc được. Trước khi thu hẹp, một trang chi tiết món để lộ 10 email khách; quét hết
 *    các trang là gom được email của gần như toàn bộ người dùng.
 *
 * UI chỉ hiển thị `user.name` (`review-list.tsx`, `reviews-preview.tsx`) nên chỉ lấy `name`.
 * "Đánh giá này của tôi không" so bằng `review.userId`, không cần `user.id`.
 *
 * Thêm field vào đây thì phải tự hỏi: field này có được phép cho người lạ xem không?
 */
export async function getReviews(filter?: { dishId?: string }): Promise<Review[]> {
  return prisma.review.findMany({
    where: filter?.dishId ? { dishId: filter.dishId } : undefined,
    select: {
      id: true,
      dishId: true,
      userId: true,
      rating: true,
      content: true,
      createdAt: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  }) as unknown as Promise<Review[]>;
}
