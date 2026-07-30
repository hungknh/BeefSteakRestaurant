import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { tableHref, type SortDir } from "@/lib/admin/table-query";

/**
 * Ô `<th>` sort được cho bảng admin. Là `<Link>` chứ không phải `<button onClick>` vì
 * sort giờ nằm ở URL (server query) — nhờ vậy chia sẻ/refresh/back đều giữ đúng thứ tự.
 *
 * Bấm lại cùng cột thì đảo chiều; đổi sang cột khác thì bắt đầu ở `asc`.
 * Luôn về trang 1 — vị trí các dòng đổi hết nên giữ `page` cũ là vô nghĩa.
 */
export function SortHeader({
  label,
  sortKey,
  activeSort,
  activeDir,
  basePath,
  search,
}: {
  label: string;
  sortKey: string;
  activeSort: string;
  activeDir: SortDir;
  basePath: string;
  search?: string;
}) {
  const isActive = activeSort === sortKey;
  const nextDir: SortDir = isActive && activeDir === "asc" ? "desc" : "asc";
  const Icon = !isActive ? ArrowUpDown : activeDir === "asc" ? ArrowUp : ArrowDown;

  return (
    <th className="px-5 py-3 font-medium" aria-sort={isActive ? `${activeDir}ending` : "none"}>
      <Link
        href={tableHref(basePath, { q: search, sort: sortKey, dir: nextDir })}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xs uppercase focus-visible:outline-2 focus-visible:outline-primary"
      >
        {label}
        {/* aria-hidden: chiều sort đã nói qua aria-sort trên <th>, icon chỉ để nhìn. */}
        <Icon
          aria-hidden
          className={isActive ? "size-3.5 text-primary" : "size-3.5 opacity-40"}
        />
      </Link>
    </th>
  );
}
