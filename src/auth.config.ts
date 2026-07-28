import type { NextAuthConfig } from "next-auth";

// Tách riêng khỏi auth.ts: file này KHÔNG được import Prisma/bcrypt (Credentials provider),
// vì middleware.ts chạy Edge runtime — Prisma Client (driver adapter libsql) không chạy được
// ở Edge. middleware chỉ cần đọc lại JWT đã có sẵn (req.auth), không cần gọi DB.
export const authConfig = {
  pages: {
    signIn: "/dang-nhap",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const role = auth?.user?.role;
      if (pathname.startsWith("/admin")) return role === "ADMIN";
      if (pathname.startsWith("/tai-khoan")) return !!auth;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
