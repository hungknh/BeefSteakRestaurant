"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * error boundary toàn cục — bắt lỗi runtime của mọi page/layout con.
 * ponytail: không thêm `global-error.tsx`; nó chỉ cần khi chính root layout ném lỗi, mà
 * root layout ở đây chỉ có font + SessionProvider, không fetch dữ liệu.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Chưa nối dịch vụ log lỗi (Sentry...) — tạm ghi console server/client để còn dấu vết.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <TriangleAlert className="size-10 text-destructive" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-foreground">Đã Có Lỗi Xảy Ra</h1>
      <p className="text-muted-foreground">
        Xin lỗi vì sự bất tiện. Bạn thử lại giúp chúng tôi, hoặc quay về trang chủ.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Mã lỗi: <span className="font-mono">{error.digest}</span>
        </p>
      )}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Thử Lại</Button>
        <Button variant="gold-outline" nativeButton={false} render={<Link href="/" />}>
          Về Trang Chủ
        </Button>
      </div>
    </div>
  );
}
