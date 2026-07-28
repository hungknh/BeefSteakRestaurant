import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Instance NextAuth riêng, nhẹ, chỉ dùng callbacks.authorized để chặn route ở Edge —
// không kéo theo Credentials/Prisma (xem ghi chú trong auth.config.ts).
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*", "/tai-khoan/:path*"],
};
