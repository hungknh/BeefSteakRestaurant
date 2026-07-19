import type { Doneness } from "@/types";

/** Key hợp nhất dòng giỏ hàng: cùng món khác độ chín/ghi chú = 2 dòng riêng. Xem PLAN.md Giai đoạn 5. */
export function cartItemKey(dishId: string, doneness: Doneness | null, note: string): string {
  return `${dishId}|${doneness ?? "none"}|${note.trim()}`;
}
