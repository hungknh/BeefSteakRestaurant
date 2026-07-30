import { describe, expect, it } from "vitest";
import en from "./en.json";
import vi from "./vi.json";
import { loginFormSchema, registerFormSchema } from "@/lib/validations/auth";
import { orderFormSchema } from "@/lib/validations/order";
import { reservationFormSchema } from "@/lib/validations/reservation";
import { reviewFormSchema } from "@/lib/validations/review";
import { translateFieldError } from "@/lib/validations/translate-error";

/** Duyệt object lồng nhau thành danh sách key phẳng: "Home.hero.line1". */
function flatKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("messages", () => {
  // Bẫy đắt nhất của i18n: thiếu key thì next-intl NÉM LỖI (không phải hiện chuỗi rỗng),
  // nên một key lệch giữa 2 file là vỡ cả trang ở đúng ngôn ngữ đó.
  it("vi.json và en.json có đúng cùng tập key", () => {
    const viKeys = flatKeys(vi).sort();
    const enKeys = flatKeys(en).sort();
    expect(enKeys.filter((k) => !viKeys.includes(k)), "có trong en, thiếu ở vi").toEqual([]);
    expect(viKeys.filter((k) => !enKeys.includes(k)), "có trong vi, thiếu ở en").toEqual([]);
  });

  it("không có message rỗng", () => {
    for (const [path, obj] of [
      ["vi", vi],
      ["en", en],
    ] as const) {
      const rong = flatKeys(obj).filter((k) => {
        const value = k.split(".").reduce<unknown>(
          (acc, part) => (acc as Record<string, unknown>)?.[part],
          obj,
        );
        return typeof value === "string" && value.trim() === "";
      });
      expect(rong, `${path}.json`).toEqual([]);
    }
  });
});

describe("key validation trong schema Zod", () => {
  // Schema công khai trả về KEY chứ không phải chữ (xem ghi chú trong validations/auth.ts).
  // Key nào không có trong `Validation` là lỗi runtime lúc người dùng nhập sai — test này
  // bắt trước, bằng cách bắt schema thực sự sinh ra lỗi rồi đối chiếu key.
  // Input phải ĐỦ field (đúng như form HTML gửi lên) nhưng giá trị sai — để chỉ message
  // của mình phát sinh. Nếu bỏ trống field, Zod sinh message mặc định của nó
  // ("Invalid input: expected string...") vốn KHÔNG phải key; trường hợp đó do
  // `translateFieldError` xử lý và được kiểm riêng ở dưới.
  const schemas = [
    ["loginFormSchema", loginFormSchema, { email: "sai", password: "" }],
    [
      "registerFormSchema",
      registerFormSchema,
      { name: "a", email: "sai", password: "ngan", confirmPassword: "khac" },
    ],
    [
      "orderFormSchema",
      orderFormSchema,
      {
        receiverName: "a",
        receiverPhone: "123",
        deliveryMethod: "DELIVERY" as const,
        address: "",
        note: "",
      },
    ],
    [
      "reservationFormSchema",
      reservationFormSchema,
      {
        guestName: "a",
        guestPhone: "123",
        guestEmail: "sai",
        date: "",
        timeSlot: "",
        partySize: 99,
        note: "",
      },
    ],
    ["reviewFormSchema", reviewFormSchema, { rating: 0, content: "ngắn" }],
  ] as const;

  it("mọi message do schema công khai sinh ra đều là key có trong Validation", () => {
    const viKeys = Object.keys(vi.Validation);
    const enKeys = Object.keys(en.Validation);

    for (const [name, schema, input] of schemas) {
      const result = schema.safeParse(input);
      expect(result.success, `${name} phải fail với input rỗng/sai để lấy được message`).toBe(
        false,
      );
      if (result.success) continue;

      for (const issue of result.error.issues) {
        expect(viKeys, `${name}: key "${issue.message}" thiếu trong vi.Validation`).toContain(
          issue.message,
        );
        expect(enKeys, `${name}: key "${issue.message}" thiếu trong en.Validation`).toContain(
          issue.message,
        );
      }
    }
  });

  // Message mặc định của Zod (field thiếu hẳn) KHÔNG phải key. Đưa thẳng vào t() thì
  // next-intl ném lỗi và vỡ trang — helper phải rơi về `invalidInput`.
  it("translateFieldError rơi về invalidInput khi message không phải key", () => {
    const tv = Object.assign((key: string) => `dịch:${key}`, {
      has: (key: string) => Object.keys(vi.Validation).includes(key),
    });

    expect(translateFieldError(tv, "phoneInvalid")).toBe("dịch:phoneInvalid");
    expect(translateFieldError(tv, "Invalid input: expected string, received undefined")).toBe(
      "dịch:invalidInput",
    );
    expect(translateFieldError(tv, undefined)).toBeUndefined();
  });
});
