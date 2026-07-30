/**
 * Đọc/ghi các tham số URL của bảng admin: `q`, `sort`, `dir`, `page`.
 *
 * `sort` đi thẳng vào `orderBy` của Prisma nên **phải qua whitelist** — tên cột lạ
 * làm Prisma ném lỗi và khách thấy trang 500, chưa kể để người ngoài dò được tên cột.
 */
export type SortDir = "asc" | "desc";

export function parseSortKey<K extends string>(
  raw: string | undefined,
  allowed: readonly K[],
  fallback: K,
): K {
  return (allowed as readonly string[]).includes(raw ?? "") ? (raw as K) : fallback;
}

export function parseSortDir(raw: string | undefined, fallback: SortDir = "desc"): SortDir {
  return raw === "asc" || raw === "desc" ? raw : fallback;
}

/** Cắt 100 ký tự: `q` đi vào truy vấn DB (đã tham số hoá), chặn chuỗi rác dài từ URL. */
export function parseSearch(raw: string | undefined): string | undefined {
  return raw?.trim().slice(0, 100) || undefined;
}

/**
 * Dựng href cho bảng admin. Bỏ hẳn tham số `undefined`/rỗng khỏi URL cho gọn, và bỏ
 * `page=1` vì đó là mặc định.
 */
export function tableHref(
  basePath: string,
  params: Record<string, string | number | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (key === "page" && Number(value) <= 1) continue;
    sp.set(key, String(value));
  }
  const query = sp.toString();
  return query ? `${basePath}?${query}` : basePath;
}
