import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";
import { localeFromPathname, stripLocale, withLocale } from "@/i18n/strip-locale";

const intlMiddleware = createMiddleware(routing);

// Instance NextAuth riêng, nhẹ, chỉ để đọc lại JWT ở Edge — không kéo theo
// Credentials/Prisma (xem ghi chú trong auth.config.ts).
const { auth } = NextAuth(authConfig);

/**
 * ⚠️ Việc chặn route nằm Ở ĐÂY, không nằm trong `callbacks.authorized`.
 *
 * Trước khi có i18n, file này là `NextAuth(authConfig).auth` (dạng "trần") — ở dạng đó
 * next-auth tự đọc `authorized` rồi tự redirect. Nhưng khi truyền handler vào `auth(...)`
 * để xếp chồng với next-intl thì next-auth KHÔNG còn tự redirect theo `authorized` nữa;
 * handler chịu trách nhiệm hoàn toàn. Bản đầu tiên của bước i18n vẫn dựa vào `authorized`
 * và làm mất hoàn toàn lớp chặn: `/admin` trả 200 cho khách chưa đăng nhập.
 *
 * Đây chỉ là lớp chặn mức UX. Lớp bảo vệ thật vẫn là `requireAdminSession()` gọi trong
 * từng Server Action (PROGRESS.md #43) — đừng bỏ nó đi vì đã có middleware.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const path = stripLocale(pathname);
  const role = req.auth?.user?.role;

  const needsAdmin = path.startsWith("/admin");
  const needsSignIn = path.startsWith("/tai-khoan");

  if ((needsAdmin && role !== "ADMIN") || (needsSignIn && !req.auth)) {
    // Giữ đúng ngôn ngữ đang xem: khách ở /en/tai-khoan phải về /en/dang-nhap, không phải
    // /dang-nhap (pages.signIn của next-auth là đường dẫn cứng nên không làm được việc này).
    const locale = localeFromPathname(pathname);
    const url = new URL(withLocale(locale, "/dang-nhap"), req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
});

export const config = {
  // Rộng hơn matcher cũ (`/admin`, `/tai-khoan`) vì next-intl phải thấy MỌI trang để
  // chèn/bỏ prefix locale. Loại trừ: /api, /_next, /_vercel và mọi path có dấu chấm
  // (favicon.ico, robots.txt, sitemap.xml, ảnh trong /public).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
