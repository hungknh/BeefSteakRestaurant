import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Dish, Doneness } from "@/types";
import { cartItemKey } from "@/lib/cart/key";

export type CartItem = {
  key: string;
  dish: Dish;
  quantity: number;
  doneness: Doneness | null;
  note: string;
};

type CartState = {
  items: CartItem[];
  addItem: (dish: Dish, quantity: number, doneness: Doneness | null, note: string) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (dish, quantity, doneness, note) =>
        set((state) => {
          const key = cartItemKey(dish.id, doneness, note);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { key, dish, quantity, doneness, note }] };
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "beefsteak-cart" },
  ),
);
