/**
 * Dịch message lỗi của Zod sang chữ hiển thị.
 *
 * Vì sao cần thay vì gọi thẳng `tv(message)`: message trong schema công khai là **key**
 * (xem `validations/auth.ts`), NHƯNG Zod vẫn có thể tự sinh message mặc định của riêng nó
 * — ví dụ field thiếu hẳn thì ra `"Invalid input: expected string, received undefined"`.
 * Đưa chuỗi đó vào `tv()` thì next-intl **ném lỗi** "message not found" và vỡ cả trang,
 * chứ không phải hiện chuỗi rỗng. `tv.has()` chặn đúng trường hợp đó.
 *
 * Phát hiện bằng test `messages/messages.test.ts`, không phải suy đoán.
 */
type Translator = ((key: string) => string) & { has: (key: string) => boolean };

export function translateFieldError(
  tv: Translator,
  message: string | undefined,
): string | undefined {
  if (!message) return undefined;
  return tv.has(message) ? tv(message) : tv("invalidInput");
}
