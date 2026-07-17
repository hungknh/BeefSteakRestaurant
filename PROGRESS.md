# Tiến độ — đọc file này trước khi tiếp tục

> File này là nguồn thông tin đầu tiên khi bắt đầu phiên làm việc mới trên project.
> Đọc xong file này rồi mới đọc `PLAN.md` (kế hoạch gốc, ít thay đổi) để biết chi tiết từng giai đoạn.
> Cập nhật file này ngay sau khi merge xong mỗi giai đoạn — đừng để dồn.

## Quy trình git (đã thống nhất với chủ dự án)

- **GitHub Flow**: `main` luôn ổn định, không commit thẳng vào `main`.
- Mỗi giai đoạn (hoặc phần việc lớn trong giai đoạn) làm trên 1 nhánh riêng: `feat/gd<N>-<mô-tả>` (vd `feat/gd1-design-system`), việc chore/tooling dùng `chore/<mô-tả>`.
- Commit theo Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`.
- Push nhánh lên GitHub thường xuyên trong lúc làm.
- Xong 1 giai đoạn (lint + build xanh) → `gh pr create` vào `main` → **squash merge** (`gh pr merge --squash --delete-branch`) → xóa nhánh.
- **Không bật Branch Protection** trên GitHub (quyết định có chủ đích, xem lịch sử chat) — tự giác đi qua nhánh + PR mà không khóa cứng ở repo settings.
- Repo: https://github.com/hungknh/BeefSteakRestaurant

## Trạng thái hiện tại

**Đã xong đến hết Giai đoạn 1.** Tiếp theo: **Giai đoạn 2 — Trang chủ**.

| Giai đoạn | Trạng thái | PR |
|---|---|---|
| 0 — Khởi tạo project | ✅ Xong | (commit trực tiếp trước khi thống nhất quy trình PR) |
| 1 — Design system + Layout shell | ✅ Xong | [#1](https://github.com/hungknh/BeefSteakRestaurant/pull/1) |
| 2 — Trang chủ | ⬜ Chưa làm | |
| 3 — Khuyến mãi + Thực đơn | ⬜ Chưa làm | |
| 4 — Discount engine | ⬜ Chưa làm | |
| 5 — Giỏ hàng + Đặt bàn (UI) | ⬜ Chưa làm | |
| 6 — Admin UI (mock) | ⬜ Chưa làm | |
| Checkpoint — Chốt frontend | ⬜ Chưa làm | |
| 7 — Database (Prisma + SQLite) | ⬜ Chưa làm | |
| 8 — Auth | ⬜ Chưa làm | |
| 9 — Nối data thật | ⬜ Chưa làm | |
| 10 — Review | ⬜ Chưa làm | |
| 11 — Admin backend | ⬜ Chưa làm | |
| 12 — Hoàn thiện (SEO/test/CI) | ⬜ Chưa làm | |
| 13 — Deploy production | ⬜ Chưa làm | |
| 14 — Đóng gói cho CV | ⬜ Chưa làm | |
| 15 — Optional | ⬜ Không làm trừ khi được yêu cầu | |

## Việc cần làm tiếp (Giai đoạn 2 — Trang chủ)

Xem PLAN.md mục 7 "GIAI ĐOẠN 2". Tóm tắt: Hero (ảnh nền full-viewport + overlay, heading 3 dòng dòng 2 serif italic gold, 2 nút), Khuyến mãi nổi bật (grid 3 cột từ `MOCK_PROMOTIONS`), Chuẩn mực Beefsteak (4 card icon lucide), Xem trước thực đơn (ảnh lớn trái + list phải từ `MOCK_DISHES`), Review khách hàng (từ `MOCK_REVIEWS`), CTA đặt bàn cuối trang.

Cần tạo `src/lib/data/dishes.ts` và `src/lib/data/promotions.ts` (bọc mock, `async`, xem PLAN.md mục 4 — 3 luật bắt buộc) vì đây là lần đầu page cần đọc dữ liệu.

## Sai khác / phát hiện so với PLAN.md gốc — đọc trước khi động vào code liên quan

1. **shadcn/ui dùng Base UI (`@base-ui/react`), không phải Radix.** Version shadcn hiện tại (`4.13.x`) mặc định sinh component dựa trên Base UI. Khác biệt quan trọng nhất: **không có `asChild`**, thay bằng prop **`render`**:
   ```tsx
   // Sai (Radix): <Button asChild><Link href="/x">...</Link></Button>
   // Đúng (Base UI): <Button render={<Link href="/x" />}>...</Button>
   ```
   Khi `render` trỏ tới phần tử không phải `<button>` thật (vd `<Link>`/`<a>`), **phải thêm `nativeButton={false}`** trên `Button`, không thì Base UI log lỗi console (đã gặp và fix ở Giai đoạn 1, xem `src/components/layout/header.tsx`).

2. **Next.js thực tế cài là 16.2.10** (mới hơn bản PLAN.md hình dung), React 19.2.4, dùng Turbopack mặc định cho `next build`/`next dev`. Chưa gặp vấn đề tương thích nào, nhưng nếu tra docs thì tra bản 16.

3. **Ảnh trong `_mock.ts` đang dùng `picsum.photos/seed/...` (placeholder ngẫu nhiên, không phải ảnh món ăn thật).** Cần thay bằng ảnh thật (chụp/mua/generate) trước khi tới mốc "Chốt frontend" — nếu không, screenshot cho CV sẽ có ảnh phong cảnh/đồ vật ngẫu nhiên cạnh tên món bít tết, trông không chuyên nghiệp.

4. **`--font-heading` trong `globals.css` được map sang `var(--font-serif)`** (không phải sans) vì shadcn sinh sẵn `SheetTitle` dùng class `font-heading`, và trong design này heading = serif. Nếu thêm component shadcn mới có dùng `font-heading`, nó sẽ tự động ra Playfair Display — đúng ý, không cần sửa.

5. **Trang chủ (`src/app/page.tsx`) hiện là placeholder kiểm tra font**, chưa phải nội dung thật — sẽ bị thay hoàn toàn ở Giai đoạn 2.

6. **Icon dùng `lucide-react`** xuyên suốt (đúng như PLAN.md liệt kê ở Giai đoạn 0), không đổi sang thư viện icon khác.

7. Môi trường sandbox lúc build **không resize được cửa sổ Chrome chính xác xuống 375px/1440px** để chụp đối chiếu Figma pixel-perfect — mới verify được qua breakpoint logic (`xl:` collapse), chưa có ảnh chụp đối chiếu thật. Nên tự kiểm lại bằng DevTools khi rảnh, đặc biệt trước mốc "Chốt frontend".

## Cách tiếp tục ở phiên mới

1. Đọc file này + `PLAN.md`.
2. `git status` / `git log --oneline -10` để xác nhận đúng những gì bảng trên ghi.
3. Chạy `npm run dev`, mở `http://localhost:3000` kiểm tra nhanh trạng thái hiện tại.
4. Tạo nhánh mới cho giai đoạn tiếp theo, làm theo PLAN.md mục 7, cập nhật lại bảng trạng thái + mục "Sai khác" trong file này trước khi mở PR của giai đoạn đó.
