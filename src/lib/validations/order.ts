import { z } from "zod";

// ⚠️ Message ở đây là **key** trong namespace `Validation` của `messages/*.json`,
// không phải chữ hiển thị. Xem ghi chú đầy đủ trong `auth.ts`.

export const orderFormSchema = z
  .object({
    receiverName: z.string().trim().min(2, "nameRequired"),
    receiverPhone: z.string().regex(/^0[35789]\d{8}$/, "phoneInvalid"),
    deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
    address: z.string().trim(),
    note: z.string().trim(),
  })
  .refine((data) => data.deliveryMethod === "PICKUP" || data.address.length >= 5, {
    message: "addressRequired",
    path: ["address"],
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;

const DONENESS_VALUES = ["RARE", "MEDIUM_RARE", "MEDIUM", "MEDIUM_WELL", "WELL_DONE"] as const;

/** Số lượng tối đa cho 1 dòng giỏ hàng và số dòng tối đa 1 đơn — chặn đơn rác. */
export const MAX_QUANTITY_PER_LINE = 50;
export const MAX_LINES_PER_ORDER = 50;

/**
 * ⚠️ Validate mảng giỏ hàng do CLIENT gửi lên trong `createOrder`.
 *
 * Bắt buộc phải có: Server Action nhận dữ liệu qua network, **type TypeScript bị xoá lúc
 * runtime** nên `quantity: number` không chặn được gì. Trước khi có schema này, client gửi
 * `quantity: -10` là vào thẳng phép tính tiền → subtotal âm → đơn hàng có total âm.
 * Server tính lại GIÁ từ DB nhưng vẫn tin SỐ LƯỢNG của client — đúng lỗ hổng mà
 * PLAN.md mục 6 yêu cầu chặn.
 *
 * Message ở đây KHÔNG cần là key i18n: mảng items không do người dùng nhập tay nên lỗi
 * chỉ xảy ra khi có ai can thiệp request; action trả về `invalidData` chung.
 */
export const orderItemInputSchema = z.object({
  dishId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
  doneness: z.enum(DONENESS_VALUES).nullable(),
  note: z.string().trim().max(500),
});

export const orderItemsSchema = z
  .array(orderItemInputSchema)
  .min(1)
  .max(MAX_LINES_PER_ORDER);
