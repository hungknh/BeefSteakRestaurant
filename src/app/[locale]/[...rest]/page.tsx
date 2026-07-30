import { notFound } from "next/navigation";

/**
 * Catch-all để URL lạ trong phạm vi locale (vd `/en/khong-ton-tai`) rơi vào
 * `app/[locale]/not-found.tsx`. Thiếu route này thì `not-found.tsx` của segment chỉ chạy
 * khi code gọi `notFound()` tường minh, còn URL không khớp sẽ rơi ra 404 fallback ở root
 * (mất Header/Footer và mất bản dịch).
 */
export default function CatchAllPage() {
  notFound();
}
