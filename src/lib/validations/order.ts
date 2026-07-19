import { z } from "zod";

export const orderFormSchema = z
  .object({
    receiverName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
    receiverPhone: z.string().regex(/^0[35789]\d{8}$/, "Số điện thoại không hợp lệ"),
    deliveryMethod: z.enum(["DELIVERY", "PICKUP"]),
    address: z.string().trim(),
    note: z.string().trim(),
  })
  .refine((data) => data.deliveryMethod === "PICKUP" || data.address.length >= 5, {
    message: "Vui lòng nhập địa chỉ giao hàng",
    path: ["address"],
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;
