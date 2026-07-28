import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pager({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const prevHref =
    currentPage > 1 ? (currentPage - 1 === 1 ? basePath : `${basePath}?page=${currentPage - 1}`) : null;
  const nextHref = currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : null;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-muted-foreground">
        Trang {currentPage} / {totalPages}
      </p>
      <div className="flex gap-2">
        {prevHref ? (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={prevHref} />}>
            Trước
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
        )}
        {nextHref ? (
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={nextHref} />}>
            Sau
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Sau
          </Button>
        )}
      </div>
    </div>
  );
}
