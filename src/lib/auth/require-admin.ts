import { auth } from "@/auth";

/**
 * Mỗi Server Action admin phải tự gọi hàm này — middleware/proxy chỉ chặn ở
 * tầng route, không áp dụng cho Server Action (xem PROGRESS.md).
 */
export async function requireAdminSession() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}
