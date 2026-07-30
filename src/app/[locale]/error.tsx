"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/**
 * error boundary trong phạm vi locale — bắt lỗi runtime của mọi page/layout con.
 * ponytail: không thêm `global-error.tsx`; nó chỉ cần khi chính root layout ném lỗi, mà
 * root layout ở đây chỉ có font + provider, không fetch dữ liệu.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    // Chưa nối dịch vụ log lỗi (Sentry...) — tạm ghi console server/client để còn dấu vết.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center sm:px-6 lg:px-8">
      <TriangleAlert className="size-10 text-destructive" strokeWidth={1.5} />
      <h1 className="font-serif text-2xl text-foreground">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          {t("errorCode")}: <span className="font-mono">{error.digest}</span>
        </p>
      )}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>{t("retry")}</Button>
        <Button variant="gold-outline" nativeButton={false} render={<Link href="/" />}>
          {t("goHome")}
        </Button>
      </div>
    </div>
  );
}
