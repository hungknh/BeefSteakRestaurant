import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * not-found toàn cục — dùng cho URL không khớp route nào. Nằm ở root nên KHÔNG có
 * Header/Footer của `(public)` (xem "Sai khác" #12 trong PROGRESS.md), tự thêm link về
 * trang chủ thay cho nav.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <Compass className="size-10 text-muted-foreground" strokeWidth={1.5} />
      <p className="font-serif text-5xl text-primary">404</p>
      <h1 className="font-serif text-2xl text-foreground">Không Tìm Thấy Trang</h1>
      <p className="text-muted-foreground">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được chuyển đi.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          Về Trang Chủ
        </Button>
        <Button variant="gold-outline" nativeButton={false} render={<Link href="/thuc-don" />}>
          Xem Thực Đơn
        </Button>
      </div>
    </div>
  );
}
