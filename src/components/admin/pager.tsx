import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { tableHref, type SortDir } from "@/lib/admin/table-query";

export function Pager({
  currentPage,
  totalPages,
  basePath,
  search,
  sort,
  dir,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  search?: string;
  sort?: string;
  dir?: SortDir;
}) {
  if (totalPages <= 1) return null;

  // Giữ q/sort/dir khi chuyển trang — thiếu là bấm "Sau" mất cả kết quả tìm kiếm lẫn
  // thứ tự đang xem.
  const hrefFor = (page: number) => tableHref(basePath, { q: search, sort, dir, page });

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
