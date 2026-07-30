import type { NextAuthConfig } from "next-auth";

// Tách riêng khỏi auth.ts: file này KHÔNG được import Prisma/bcrypt (Credentials provider),
// vì proxy.ts chạy Edge runtime — Prisma Client (driver adapter) không chạy được ở Edge.
// proxy chỉ cần đọc lại JWT đã có sẵn (req.auth), không cần gọi DB.
//
// ⚠️ KHÔNG có `callbacks.authorized` ở đây — cố ý. `proxy.ts` truyền handler vào `auth(...)`
// (để xếp chồng với middleware i18n), và ở dạng đó next-auth KHÔNG đọc `authorized` nữa.
// Để lại callback này thì nó thành code chết trông như đang bảo vệ route mà thực ra không.
// Logic chặn route nằm trong `proxy.ts`.
export const authConfig = {
  pages: {
    signIn: "/dang-nhap",
  },
  providers: [],
  callbacks: {
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
