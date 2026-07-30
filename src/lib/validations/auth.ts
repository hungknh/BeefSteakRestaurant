import { z } from "zod";

/**
 * ⚠️ Message ở đây là **key** trong namespace `Validation` của `messages/*.json`, không
 * phải chữ hiển thị. Lý do: schema là hằng ở tầng module, dùng chung client/server, nên
 * không gọi được `getTranslations()` bên trong. Chỗ hiển thị dịch bằng
 * `tv(errors.x.message)` — xem `login-form.tsx`.
 *
 * Đổi key ở đây thì phải đổi trong CẢ HAI file messages, không thì next-intl ném lỗi
 * "message not found" thay vì hiện chữ.
 *
 * Schema của admin (`dish.ts`, `promotion.ts`) cố tình GIỮ chữ tiếng Việt — khu admin
 * không dịch (PROGRESS.md #59).
 */
export const loginFormSchema = z.object({
  email: z.string().trim().email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, "nameRequired"),
    email: z.string().trim().email("emailInvalid"),
    password: z.string().min(8, "passwordTooShort"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
