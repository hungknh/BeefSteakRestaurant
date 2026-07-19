export function filterBySearch<T>(items: T[], search: string, getText: (item: T) => string): T[] {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => getText(item).toLowerCase().includes(q));
}

export function sortBy<T>(items: T[], key: keyof T, direction: "asc" | "desc"): T[] {
  const sorted = [...items].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv));
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}
