import { describe, expect, it } from "vitest";
import { filterBySearch, sortBy } from "./table-utils";

type Item = { name: string; price: number };

const items: Item[] = [
  { name: "Bít Tết Ribeye", price: 890000 },
  { name: "Bít Tết Wagyu", price: 1890000 },
  { name: "Salad Caesar", price: 120000 },
];

describe("filterBySearch", () => {
  it("khớp không phân biệt hoa thường", () => {
    expect(filterBySearch(items, "ribeye", (i) => i.name)).toEqual([items[0]]);
  });

  it("search rỗng -> trả về nguyên danh sách", () => {
    expect(filterBySearch(items, "  ", (i) => i.name)).toEqual(items);
  });

  it("không khớp -> mảng rỗng", () => {
    expect(filterBySearch(items, "khong-ton-tai", (i) => i.name)).toEqual([]);
  });
});

describe("sortBy", () => {
  it("sort số tăng dần", () => {
    expect(sortBy(items, "price", "asc").map((i) => i.price)).toEqual([120000, 890000, 1890000]);
  });

  it("sort số giảm dần", () => {
    expect(sortBy(items, "price", "desc").map((i) => i.price)).toEqual([1890000, 890000, 120000]);
  });

  it("sort chuỗi theo bảng chữ cái", () => {
    expect(sortBy(items, "name", "asc").map((i) => i.name)).toEqual([
      "Bít Tết Ribeye",
      "Bít Tết Wagyu",
      "Salad Caesar",
    ]);
  });

  it("không mutate mảng gốc", () => {
    const copy = [...items];
    sortBy(items, "price", "desc");
    expect(items).toEqual(copy);
  });
});
