"use client";

// next/link (KHÔNG phải Link của @/i18n/navigation): file này nằm ngoài segment [locale]
// nên không có ngữ cảnh locale để thêm prefix.
import Link from "next/link";

/**
 * 404 fallback NGOÀI segment `[locale]` — chỉ chạy cho request không khớp locale nào và
 * không qua được middleware. Phải tự render `<html>/<body>` vì root layout thật nằm ở
 * `app/[locale]/layout.tsx`, ở đây không có layout nào bọc.
 *
 * ponytail: để tối giản có chủ đích, không tái dùng thiết kế 404 đẹp — trang này gần như
 * không ai thấy. Bản người dùng thật gặp là `app/[locale]/not-found.tsx`.
 */
export default function GlobalNotFound() {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0c0a09",
          color: "#fafaf9",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem" }}>404</h1>
          <p style={{ margin: "0 0 1.5rem", color: "#a8a29e" }}>
            Không tìm thấy trang. / Page not found.
          </p>
          <Link href="/" style={{ color: "#d4af37" }}>
            Beef Haven
          </Link>
        </div>
      </body>
    </html>
  );
}
