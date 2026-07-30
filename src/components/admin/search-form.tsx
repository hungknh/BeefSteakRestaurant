import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ponytail: <form> GET thuần, không useRouter/debounce. Submit về đúng URL hiện tại
// (giữ prefix locale) và THAY THẾ query string cũ — nhờ vậy `?page=3` tự rụng, tìm
// kiếm mới luôn bắt đầu từ trang 1. Không cần state.
//
// ⚠️ `action=""` là BẮT BUỘC, không phải thừa: bỏ nó đi thì React 19 nuốt luôn sự
// kiện submit (form không có `action` bị coi là form action rỗng → preventDefault,
// không điều hướng). Đã gặp thật khi test bằng browser — cả Enter lẫn nút "Tìm" đều
// im lặng không làm gì, build/lint/test đều xanh. `action=""` = URL hiện tại.
export function AdminSearchForm({
  defaultValue,
  placeholder,
  sort,
  dir,
}: {
  defaultValue?: string;
  placeholder: string;
  sort?: string;
  dir?: string;
}) {
  return (
    <form action="" className="flex gap-2 border-b border-border p-5">
      {/* Form GET thay THẾ cả query string, nên phải mang sort/dir theo bằng hidden
          input — không có thì tìm kiếm mới làm mất thứ tự đang xem. Cố ý KHÔNG mang
          `page`: tìm mới thì phải về trang 1. */}
      {sort ? <input type="hidden" name="sort" value={sort} /> : null}
      {dir ? <input type="hidden" name="dir" value={dir} /> : null}
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="max-w-xs"
      />
      <Button type="submit" variant="outline" size="sm">
        Tìm
      </Button>
    </form>
  );
}
