"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { slugify } from "@/lib/slug";
import { dishFormSchema, type DishFormValues } from "@/lib/validations/dish";

function revalidateDishPaths(slug?: string) {
  revalidatePath("/admin/dishes");
  revalidatePath("/admin");
  revalidatePath("/thuc-don");
  if (slug) revalidatePath(`/thuc-don/${slug}`);
}

export async function createDish(values: DishFormValues) {
  const parsed = dishFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const slug = slugify(parsed.data.name);
  const existing = await prisma.dish.findUnique({ where: { slug } });
  if (existing) return { error: "Đã có món trùng tên (trùng đường dẫn), đổi tên khác." };

  await prisma.dish.create({
    data: {
      id: `dish-${randomUUID()}`,
      slug,
      avgRating: 0,
      reviewCount: 0,
      ...parsed.data,
    },
  });

  revalidateDishPaths(slug);
  return { success: true as const };
}

export async function updateDish(dishId: string, values: DishFormValues) {
  const parsed = dishFormSchema.safeParse(values);
  if (!parsed.success) return { error: "Dữ liệu không hợp lệ." };

  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish) return { error: "Không tìm thấy món ăn." };

  // Không đổi slug khi sửa — giữ nguyên URL đã có, tránh vỡ link/SEO.
  await prisma.dish.update({ where: { id: dishId }, data: parsed.data });

  revalidateDishPaths(dish.slug);
  return { success: true as const };
}

export async function deleteDish(dishId: string) {
  const session = await requireAdminSession();
  if (!session) return { error: "Bạn không có quyền thực hiện thao tác này." };

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish) return { error: "Không tìm thấy món ăn." };

  try {
    await prisma.dish.delete({ where: { id: dishId } });
  } catch {
    return {
      error:
        'Không thể xóa món này vì đã có đơn hàng/đánh giá liên quan. Chuyển sang "Hết Món" thay vì xóa.',
    };
  }

  revalidateDishPaths(dish.slug);
  return { success: true as const };
}
