import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * ⚠️ Dùng `Link`/`redirect`/`useRouter` từ file này, KHÔNG dùng trực tiếp từ `next/link`
 * hay `next/navigation` cho điều hướng nội bộ — bản của next-intl tự thêm prefix locale,
 * bản gốc thì không, dẫn tới đang ở `/en/...` mà bấm link là nhảy về tiếng Việt.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
