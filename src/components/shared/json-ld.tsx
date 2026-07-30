/**
 * Nhúng structured data schema.org. Next tự escape `dangerouslySetInnerHTML` không đủ
 * cho JSON-LD (dấu `<` trong dữ liệu có thể phá thẻ script) nên thay `<` thành `<`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
