import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function Pager({
  currentPage,
  totalPages,
  basePath,
  search,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  search?: string;
}) {
  if (totalPages <= 1) return null;

  // Giữ `q` khi chuyển trang — thiếu bước này thì bấm "Sau" là mất kết quả tìm kiếm.
  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const prevHref = currentPage > 1 ? hrefFor(currentPage - 1) : null;
  const nextHref = currentPage < totalPages ? hrefFor(currentPage + 1) : null;

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
