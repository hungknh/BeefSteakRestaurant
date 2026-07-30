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
- **⚠️⚠️ TUYỆT ĐỐI KHÔNG thêm dòng ghi công AI (`Co-Authored-By: <tên AI>`) vào commit message** — dù công cụ AI mặc định hay làm vậy. Chủ dự án yêu cầu contributor trên GitHub chỉ có mình mình. **Đây không phải chuyện dọn được sau:** một dòng như vậy lọt vào 1 PR là GitHub giữ vĩnh viễn trong `refs/pull/*`, rewrite `main` không gỡ được, và **đã phải xoá repo tạo lại toàn bộ để dứt điểm** (xem "Sai khác" #44 và #74). Kiểm trước mỗi lần commit: `git log -1 --format='%(trailers)'` phải trả về rỗng.
- **⚠️ Đừng squash-merge một PR chứa nhiều commit lịch sử.** Squash gộp hết thành 1 commit — với PR thường thì đúng ý, nhưng nếu PR mang cả lịch sử nhiều giai đoạn thì mất sạch dấu vết quá trình làm việc, vốn là thứ giá trị nhất của repo CV này.
- **⚠️ Tên file là `PROGRESS.md` VIẾT HOA.** Windows không phân biệt hoa/thường nên `Read`/`Edit` với `progress.md` vẫn sửa đúng file, nhưng `git add progress.md` thì **im lặng không stage gì** (git phân biệt hoa/thường). Hệ quả: sửa xong tưởng đã commit mà thực ra không có trong commit. Luôn dùng đúng `PROGRESS.md`, và kiểm bằng `git status --short` trước khi commit.
- Repo: https://github.com/hungknh/BeefSteakRestaurant

## Trạng thái hiện tại

**Đã xong toàn bộ Giai đoạn 0–15.** Web live **đọc/ghi database thật** (Neon Postgres), không còn mock tĩnh. **Link demo: https://beefsteakhouse.vercel.app** — đăng nhập thử: `admin@beefhaven.vn` / `admin1234` (admin) hoặc bất kỳ email nào trong DB / `password123` (khách). Từ 2026-07-30 bản deploy Vercel **tự cập nhật theo mỗi push lên `main`** (đã nối GitHub ↔ Vercel — xem "Sai khác" #54, thay thế #26).

**Database đã chuyển từ SQLite sang Neon Postgres** (sớm hơn dự tính PLAN.md Giai đoạn 13) — lý do: cần DB thật để bản deploy trên Vercel phản ánh dữ liệu thật, không chỉ đọc mock. Xem "Sai khác" #37–#39 trước khi động vào `schema.prisma`/`prisma/seed.ts`/`src/lib/prisma.ts`.

**Dữ liệu hiện tại là dữ liệu lịch sử giả nhưng chân thực** — sinh từ 01/2025 đến hiện tại (574 ngày), theo hệ số thực tế (tăng trưởng dần, cuối tuần đông hơn, Tết/Valentine/Giáng Sinh), dùng đúng `bestPromotion()` thật của app để tính giảm giá: **632 đơn hàng, 457 đặt bàn, 113 đánh giá, 71 người dùng** (số đếm thật từ DB ngày 2026-07-30 — xem #57). Xem "Sai khác" #40–#41. Muốn seed lại từ đầu: xem mục "Cách tiếp tục ở phiên mới".

⚠️ **Repo đã được tạo lại từ đầu ngày 2026-07-30 (xem "Sai khác" #74) — mọi số PR cũ (#1–#34) KHÔNG còn tồn tại trên GitHub.** Lịch sử code thì giữ đủ 39 commit. Vì vậy bảng dưới trỏ tới **commit squash trên `main`** thay vì link PR, và các `(#N)` nằm trong tiêu đề commit chỉ là chữ, bấm vào không ra gì. Các `#N` trong mục "Sai khác" của file này là **số thứ tự nội bộ của file**, không liên quan PR — vẫn dùng bình thường.

| Giai đoạn | Trạng thái | Commit squash trên `main` |
|---|---|---|
| 0 — Khởi tạo project | ✅ Xong | (commit trực tiếp trước khi thống nhất quy trình PR) |
| 1 — Design system + Layout shell | ✅ Xong | [49d3369](https://github.com/hungknh/BeefSteakRestaurant/commit/49d3369) |
| 2 — Trang chủ | ✅ Xong | [ab6a49e](https://github.com/hungknh/BeefSteakRestaurant/commit/ab6a49e) |
| 3 — Khuyến mãi + Thực đơn | ✅ Xong | [0d5c9b2](https://github.com/hungknh/BeefSteakRestaurant/commit/0d5c9b2) |
| 4 — Discount engine | ✅ Xong | [5fc3da9](https://github.com/hungknh/BeefSteakRestaurant/commit/5fc3da9) |
| 5 — Giỏ hàng + Đặt bàn (UI) | ✅ Xong | [657f795](https://github.com/hungknh/BeefSteakRestaurant/commit/657f795) |
| 6 — Admin UI (mock) | ✅ Xong | [9e994e1](https://github.com/hungknh/BeefSteakRestaurant/commit/9e994e1) |
| Checkpoint — Chốt frontend | ✅ Xong | [c41117a](https://github.com/hungknh/BeefSteakRestaurant/commit/c41117a) |
| 7 — Database (Prisma + Postgres) | ✅ Xong | [ec683bd](https://github.com/hungknh/BeefSteakRestaurant/commit/ec683bd) |
| 8 — Auth | ✅ Xong | [15b491c](https://github.com/hungknh/BeefSteakRestaurant/commit/15b491c) |
| 9 — Nối data thật + dữ liệu lịch sử + dashboard thống kê | ✅ Xong | [6f5a5e2](https://github.com/hungknh/BeefSteakRestaurant/commit/6f5a5e2) |
| 10 — Review | ✅ Xong | [b5925d2](https://github.com/hungknh/BeefSteakRestaurant/commit/b5925d2) |
| 11 — Admin backend | ✅ Xong (upload ảnh UploadThing đã **cắt khỏi phạm vi** theo quyết định chủ dự án — xem "Sai khác" #45) | [bdea55b](https://github.com/hungknh/BeefSteakRestaurant/commit/bdea55b), [ba18af5](https://github.com/hungknh/BeefSteakRestaurant/commit/ba18af5), [b27dcdc](https://github.com/hungknh/BeefSteakRestaurant/commit/b27dcdc) |
| 12 — Hoàn thiện (SEO/test/CI) | ✅ Xong (Playwright đã **cắt khỏi phạm vi** — xem "Sai khác" #46) | [3406051](https://github.com/hungknh/BeefSteakRestaurant/commit/3406051) |
| 13 — Deploy production | ✅ Xong (2 env trong checklist PLAN.md không set vì tính năng tương ứng đã cắt — xem "Sai khác" #70) | |
| 14 — Đóng gói cho CV | ✅ Xong | [85aceac](https://github.com/hungknh/BeefSteakRestaurant/commit/85aceac) |
| 15 — Optional: i18n Việt/Anh | ✅ Xong (3/3 PR) — chỉ làm i18n, 3 mục còn lại đã cắt | [9276ead](https://github.com/hungknh/BeefSteakRestaurant/commit/9276ead), [233ad2c](https://github.com/hungknh/BeefSteakRestaurant/commit/233ad2c), [790bfed](https://github.com/hungknh/BeefSteakRestaurant/commit/790bfed) |

## Việc cần làm tiếp

**Đã xong toàn bộ Giai đoạn 0–15. Website hoàn chỉnh. Không còn việc bắt buộc.** Những mục dưới đây chỉ làm nếu chủ dự án muốn:

1. **Dịch khu admin sang tiếng Anh** — hiện cố ý chỉ có tiếng Việt (#59). Catalog messages đã có sẵn hạ tầng, chỉ cần thêm namespace.
2. **Sort server-side cho `/admin/orders` và `/admin/reservations`** — search đã lên server (#71), riêng sort vẫn chỉ xếp trong 20 dòng của trang hiện tại.
3. **Quay lại `npm ci` trong CI** khi xung đột ajv upstream được sửa (#62).
4. **Đưa `NEXT_PUBLIC_SITE_URL` vào Vercel env** nếu sau này có custom domain (mặc định code tự lấy `VERCEL_PROJECT_PRODUCTION_URL`, xem `src/lib/site.ts`).
5. **Các mục Giai đoạn 15 đã cắt**: VNPay/Momo sandbox, email Resend, Blog/CMS (xem #58).

Các mục đã cắt khỏi phạm vi (không phải việc còn nợ): upload ảnh UploadThing (#45), Playwright E2E (#46), custom domain (dự án quy mô CV, dùng domain `*.vercel.app` là đủ).

**Đã xong toàn bộ Giai đoạn 10, 11, 12.** Giai đoạn 11: mọi CRUD/đổi trạng thái/phân trang admin đều nối Server Action thật, tự check `role === "ADMIN"` qua `requireAdminSession()` (`src/lib/auth/require-admin.ts`, dùng chung), đã test qua browser thật. Chi tiết xem "Sai khác" #42–#44. Mục "Stat" của Giai đoạn 11 (doanh thu/số đơn/booking hôm nay/món bán chạy) **đã xong sẵn từ Giai đoạn 9**, không cần làm lại.

⚠️ **Đánh đổi còn lại ở phân trang admin** (`/admin/orders`, `/admin/reservations`): **search đã lên server-side** (`searchParams.q`, xem #71) nên tìm xuyên toàn bộ 632 đơn / 457 đặt bàn. Riêng **sort vẫn là client-side**, chỉ xếp trong 20 dòng của trang hiện tại — cố ý chưa làm.

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

5. **Icon dùng `lucide-react`** xuyên suốt (đúng như PLAN.md liệt kê ở Giai đoạn 0), không đổi sang thư viện icon khác.

6. Môi trường sandbox lúc build **không resize được cửa sổ Chrome chính xác xuống 375px/1440px** để chụp đối chiếu Figma pixel-perfect — mới verify được qua breakpoint logic (`xl:` collapse), chưa có ảnh chụp đối chiếu thật. Nên tự kiểm lại bằng DevTools khi rảnh, đặc biệt trước mốc "Chốt frontend".

7. **Đã xác nhận trực quan (Giai đoạn 2): ảnh `picsum.photos` random ra phong cảnh/đồ vật không liên quan** (núi, thác nước, tượng Nữ thần Tự do...) cạnh tên món bít tết — không chỉ là rủi ro lý thuyết nữa, cần thay ảnh thật trước khi chốt frontend (mục 3 ở trên).

8. **`Button` (`src/components/ui/button.tsx`) có thêm variant `"gold-outline"`** (Pattern D trong PLAN.md mục 2.3 — nút viền vàng, nền trong suốt, chữ gold uppercase). Dùng variant này thay vì tự viết class thủ công mỗi lần cần "nút viền" (đã dùng ở `PromoCard`, `Hero`, `MenuPreview`).

9. **`lib/data/dishes.ts`, `promotions.ts`, `reviews.ts` đã tồn tại** (bọc mock, `async`, đúng luật mục 4 PLAN.md). Giai đoạn 9 sẽ thay ruột sang Prisma — chữ ký hàm giữ nguyên.

10. **`components/shared/rating-stars.tsx` đã có** (dùng ở trang chủ phần Review, sẽ tái dùng ở Giai đoạn 3 phần review chi tiết món).

11. **Sửa `next.config.ts` xong PHẢI restart dev server thủ công** — Turbopack không tự nạp lại file config này (gặp lỗi `next-error not-found` / 500 sau khi thêm `images.remotePatterns` mà không restart). Cách kiểm tra nhanh: `netstat -ano | grep ":3000"` để tìm đúng PID đang LISTEN (có thể khác PID Next.js báo lúc khởi động nếu server đã tự phục hồi sau lỗi trước đó), `taskkill //PID <pid> //F`, rồi `npm run dev` lại.

12. **Route group `(public)` đã tách ra từ Giai đoạn 3** — `src/app/layout.tsx` (root) giờ chỉ còn `html`/`body`/font, KHÔNG còn Header/Footer. Header/Footer chuyển vào `src/app/(public)/layout.tsx`. Lý do: Giai đoạn 6 (admin) và Giai đoạn 8 (auth) cần layout hoàn toàn khác (sidebar+topbar / màn hình đăng nhập tối giản), Next.js layout lồng nhau là cộng dồn nên không thể "bỏ" Header/Footer nếu chúng nằm ở root. Trang mới thêm sau này (dat-ban, gio-hang, thanh-toan, lien-he, tai-khoan/*) đặt trong `(public)/` để tự động có Header/Footer; `admin/*` và `(auth)/*` đặt ở cấp ngang hàng `(public)/`, KHÔNG lồng bên trong.

13. **`lib/data/categories.ts` đã có** (`getCategories()`), `getDishBySlug`, `getPromotionBySlug` cũng đã thêm vào `dishes.ts`/`promotions.ts`. `lib/format.ts` có thêm `formatDaysOfWeek()` (dịch CSV "1,4,6" sang "Thứ Hai, Thứ Năm...").

14. ~~`components/menu/order-panel.tsx` chưa nối Zustand cart store~~ — **đã nối xong ở Giai đoạn 5** (`OrderPanel` nhận prop `dish`, gọi `useCartStore().addItem()`).

15. **Xóa `src/components/ui/badge.tsx`** (thêm nhầm lúc `shadcn add`, không dùng đến — badge maroon/gold trên `PromoCard`/`DishCard` tự viết `<span>` thủ công vì cần màu riêng ngoài theme mặc định của shadcn Badge).

16. **Đã fix 1 bug layout ở Giai đoạn 3:** `ReviewList` dùng `justify-between` cho hàng tên + rating sao trong cột review — ở màn hình rộng (cột review chiếm gần hết `max-w-6xl`), `justify-between` đẩy sao ra sát mép phải, cách xa tên. Đã sửa thành `flex items-center gap-3` (tên + sao đứng sát nhau). Cẩn thận pattern này ở các list item khác nằm trong cột rất rộng.

17. **`store/cart.ts` lưu nguyên object `Dish` snapshot trong mỗi `CartItem`** (không chỉ `dishId`), để Header/CartDrawer/trang giỏ hàng tự đủ dữ liệu hiển thị mà không cần fetch lại danh sách món. Key hợp nhất dòng = `dishId + doneness + note` (`lib/cart/key.ts`, hàm `cartItemKey`, có Vitest). Giai đoạn 9 khi có DB thật vẫn giữ pattern này — server luôn tính lại giá qua `bestPromotion()`, không tin số client gửi (xem PLAN.md mục 6).

18. **⚠️ Bug Base UI Select hay gặp — nhớ kỹ khi thêm Select mới:** `<Select.Value>` (component `SelectValue` trong `components/ui/select.tsx`) **mặc định hiển thị raw `value` string**, không tự tra label như Radix. Phải luôn truyền `children` dạng function:
    ```tsx
    <SelectValue placeholder="...">
      {(value: string) => categories.find(c => c.id === value)?.name}
    </SelectValue>
    ```
    Thiếu bước này thì UI hiện thẳng `"cat-steak"` thay vì `"Bít Tết"` — đã gặp và fix ở toàn bộ 7 chỗ dùng Select trong Giai đoạn 6 (`dish-form-dialog.tsx`, `promotion-form-dialog.tsx` ×4, `reservations-table.tsx`, `orders-table.tsx`).

19. **`lib/data/reservations.ts` (`getReservations()`) và `lib/data/orders.ts` (`getOrders()`) đã có** ở Giai đoạn 6, cùng `MOCK_RESERVATIONS`/`MOCK_ORDERS` trong `_mock.ts` (6 bản ghi mỗi loại, đủ trạng thái). `promotions.ts` có thêm `getAllPromotions()` (không lọc `isActive`, dùng riêng cho admin — `getPromotions()` gốc vẫn chỉ trả khuyến mãi đang bật, dùng cho trang khách).

20. **Admin CRUD (Giai đoạn 6) chỉ sửa `useState` cục bộ trong `DishesTable`/`PromotionsTable`/`ReservationsTable`/`OrdersTable`, KHÔNG persist.** Reload trang là mất thay đổi — đúng như kế hoạch "Admin UI (mock)". Giai đoạn 11 mới nối Server Actions thật.

21. **⚠️ Xác nhận lại: sandbox môi trường dev KHÔNG resize được viewport Chrome thật** — gọi tool resize 375×812 xong đọc `window.innerWidth` vẫn ra 1536 (kích thước gốc), thử lại thì window vỡ luôn (196×20, không dùng được nữa phải mở tab mới). Đừng tốn thời gian thử lại cách này; audit responsive nên đi bằng cách đọc code (`grid-cols-*` có breakpoint fallback chưa, phần tử nào có thể tràn ngang) thay vì chụp ảnh đối chiếu. Cách này đã tìm ra bug thật: **5 bảng trong admin (`admin/page.tsx` + 4 file `components/admin/*-table.tsx`) dùng `<table className="w-full">` không có wrapper `overflow-x-auto`** → tràn ngang trên màn hình hẹp. Đã bọc `<div className="overflow-x-auto">` quanh cả 5 bảng. Bảng mới thêm sau này nhớ bọc theo pattern này luôn.

22. **⚠️ 2 phát hiện accessibility ở checkpoint "Chốt frontend", nhớ khi thêm bảng/nút tùy biến mới:**
    - Cột sort trong bảng admin ban đầu dùng `<th onClick={...}>` — `<th>` không phải phần tử focusable, người dùng bàn phím (Tab) không thao tác được, hoàn toàn phụ thuộc chuột. Đã sửa: bọc label trong `<button type="button" onClick={...}>` nằm trong `<th>`.
    - **`text-transform` (class `uppercase`) KHÔNG tự kế thừa vào `<button>`/`<input>`/`<select>`/`<textarea>`** theo UA stylesheet mặc định của trình duyệt (khác với `color`/`font` vốn kế thừa qua `font: inherit` mà Tailwind Preflight áp cho các form control) — dù cha có `uppercase`, con là `<button>` vẫn hiện chữ thường. Gặp đúng lỗi này khi bọc `<button>` vào `<th className="... uppercase">` ở trên: phải khai báo lại `uppercase` tường minh trên chính `<button>`.
    - Đã thêm `focus-visible:outline-2 focus-visible:outline-primary` (gold, khớp design system) cho: nút sort trong bảng admin, time-slot picker ở `/dat-ban` (`reservation-form.tsx`), day-of-week toggle trong form khuyến mãi admin (`promotion-form-dialog.tsx`). Trước đó 2 chỗ sau chỉ có outline mặc định của trình duyệt (vẫn nhìn thấy được, nhưng không đồng bộ màu).

23. **⚠️ `next/image` không load được ảnh logo nhỏ (36×36) trong môi trường dev sandbox này** — dù `<Image>` dùng đúng cú pháp (kể cả thêm `priority`), request tới `/_next/image?...` cho logo không bao giờ hoàn tất khi trình duyệt tự load (dù gọi `fetch()` thủ công tới đúng URL đó thì lại 200 OK bình thường) — `img.complete` mãi `false`, `naturalWidth` = 0. File tĩnh `/images/logo.jpg` gốc thì luôn load được. Chưa rõ nguyên nhân sâu xa (nghi ngờ liên quan sandbox Chrome automation, xem thêm #6/#21 về các vấn đề rendering khác của sandbox này), nhưng cách né đơn giản và hợp lý: thêm prop **`unoptimized`** cho `<Image>` — logo là icon tĩnh cố định, không cần Next tự resize/tối ưu on-demand. Đã áp dụng ở cả 3 chỗ dùng logo (`header.tsx`, `footer.tsx`, `admin-sidebar.tsx`). Nếu sau này có ảnh nhỏ khác (icon, avatar cố định) gặp tình trạng tương tự thì thử `unoptimized` trước khi đào sâu debug.

24. **Ảnh khuyến mãi đổi tên file lần 2, sau khi đã "Chốt frontend" ở #5 phần "Việc cần làm tiếp".** Chủ dự án gửi lại đúng 5 file `img/gio-vang.jpg`, `img/steak-night.jpg`, `img/lang-man.jpg`, `img/dat-nhieu.jpg`, `img/combo-cuoi-tuan.jpg` — kiểm bằng `md5sum`/`cmp` thì **nội dung y hệt** 5 file `promo-*.jpg` đang dùng (byte-for-byte), chỉ khác tên. Theo yêu cầu, đã copy 5 file này vào `public/images/` giữ nguyên tên gốc (không prefix `promo-`) và sửa `imageUrl` của 5 `Promotion` trong `_mock.ts` (`promo-steak-night`, `promo-gio-vang`, `promo-lang-man`, `promo-combo-cuoi-tuan`, `promo-dat-nhieu`) trỏ sang `/images/steak-night.jpg` v.v. File `promo-*.jpg` cũ vẫn còn trong `public/images/` nhưng không còn được `imageUrl` nào tham chiếu — dọn khi rảnh.

25. **Đổi font toàn site (`src/app/layout.tsx`)** — chủ dự án yêu cầu font "mềm mại, trang trọng, cổ điển" cho toàn bộ web, không riêng heading:
    - `--font-serif` (dùng cho `font-serif`/`font-heading`, áp cho h1-h3, tên món, tên khuyến mãi, giá, logo header/footer — xem danh sách đầy đủ bằng `grep -rn "font-serif\|font-heading" src/components`): `Playfair_Display` → **`Cormorant_Garamond`** (weight 500/600/700), serif cổ điển nét mảnh mềm hơn Playfair.
    - `--font-sans` (mặc định toàn trang qua `html { @apply font-sans }` ở `globals.css`, nên mọi đoạn mô tả món/khuyến mãi, form, bảng admin... đều ăn theo, không cần sửa từng component): `Inter` → **`Lora`**, serif ấm dễ đọc hơn Garamond ở cỡ chữ nhỏ.
    - Cả 2 font đều khai báo `subsets: ["latin", "vietnamese"]` — giữ nguyên dấu tiếng Việt, không cần cấu hình thêm ở `next.config.ts`.
    - **Chưa verify trực quan bằng trình duyệt** — sandbox này không kết nối được Chrome extension (`mcp__claude-in-chrome__tabs_context_mcp` báo "Browser extension is not connected"). Chỉ xác nhận `next dev` compile sạch, không lỗi. Chủ dự án cần tự mở `localhost:3000` kiểm tra bằng mắt, đặc biệt cỡ chữ/line-height vì đổi họ font có thể lệch nhịp đọc ở vài chỗ.

26. **Deploy Vercel lần đầu (2026-07-28) làm bằng `npx vercel --prod --yes`, KHÔNG qua GitHub Integration.** CLI tự tạo project `hung-dfd0/beefsteakhouse` (tên phải lowercase — thư mục `BeefSteak` bị Vercel từ chối vì có chữ hoa, phải truyền tên qua package.json `beefsteakhouse`) và deploy thẳng file local, bỏ qua bước push git trước. Bước "Connecting GitHub repository" tự động bị lỗi (`Failed to connect hungknh/BeefSteakRestaurant to project`) — nghi do sandbox không có quyền OAuth GitHub App của Vercel, không phải lỗi tên repo. **Hệ quả: các commit sau này KHÔNG tự deploy** — mỗi lần muốn cập nhật demo phải chạy lại `npx vercel --prod --yes` thủ công, hoặc chủ dự án tự vào Vercel Dashboard → Project Settings → Git để nối GitHub repo (khuyến nghị làm việc này để khớp quy trình CI ở Giai đoạn 12/13).

27. **Prisma cài thực tế là 7.9.1** (PLAN.md mục 0 hình dung bản Prisma cũ, generator mặc định `prisma-client-js` xuất thẳng vào `node_modules/@prisma/client`). Bản 7 dùng generator mới `prisma-client`, xuất code ra `src/generated/prisma` (đã gitignore, chạy `prisma generate` để tạo lại). Import `PrismaClient` từ `@/generated/prisma/client`, **không phải** `@prisma/client` (package `@prisma/client` giờ chỉ chứa runtime/type phụ trợ). `prisma init` cũng tự tạo `prisma.config.ts` ở root (thay cho khai báo `"prisma"` trong `package.json` của bản cũ) — sửa seed command, schema path ở đây.
28. **Prisma 7 bắt buộc "driver adapter" ngay cả với SQLite** — khởi tạo `new PrismaClient()` trơn báo lỗi `PrismaClientInitializationError`. Thử `@prisma/adapter-better-sqlite3` trước (theo skill doc chính thức) nhưng `better-sqlite3` cần biên dịch native qua `node-gyp`, máy này không có Visual Studio C++ Build Tools nên cài lỗi. Chuyển sang **`@prisma/adapter-libsql`** (`@libsql/client`) — có binary build sẵn cho Windows, không cần compiler. Cả `src/lib/prisma.ts` và `prisma/seed.ts` đều khởi tạo `PrismaLibSql({ url: ... })` rồi truyền vào `new PrismaClient({ adapter })`. Nếu sau này đổi sang Postgres (Giai đoạn 13) phải đổi sang adapter Postgres tương ứng (`@prisma/adapter-pg` hoặc dùng Prisma Postgres/Neon adapter riêng), không phải chỉ đổi `provider` trong schema như Prisma cũ.
29. **`DATABASE_URL` phải ghi tường minh `file:./prisma/dev.db`, không phải `file:./dev.db`.** Prisma 7 (qua `prisma.config.ts`) resolve đường dẫn SQLite tương đối theo thư mục chạy lệnh (project root), khác bản cũ resolve theo vị trí `schema.prisma`. Ban đầu để `file:./dev.db` thì `prisma migrate dev` tạo nhầm file ở root (`./dev.db`) — không khớp `.gitignore` sẵn có (`/prisma/dev.db`), suýt lọt vào git. Đã sửa `.env` thành `file:./prisma/dev.db` và migrate lại đúng chỗ.
30. **Đã thêm `"postinstall": "prisma generate"` vào `package.json` ngay từ Giai đoạn 7**, sớm hơn dự tính của PLAN.md mục Giai đoạn 13 (`"build": "prisma generate && next build"`). Lý do: `next build` typecheck theo `tsconfig.json` (`include: **/*.ts`), bao trùm cả `prisma/seed.ts`/`src/lib/prisma.ts` dù chưa có page nào import — build sẽ lỗi `Cannot find module '.../generated/prisma/client'` trên máy sạch/CI nếu client chưa được generate sẵn (đã tự tay verify bằng cách xóa `src/generated` rồi build lại, thấy lỗi, thêm `postinstall` xong hết lỗi).
31. **`prisma init` (bản 7) tự cài thêm tài liệu "skill" cho AI coding assistant** vào `.agents/`, `.claude/`, `.windsurf/`, `skills-lock.json` ở root (tham khảo CLI/Client API/driver adapter...). Không phải code dự án, đã thêm vào `.gitignore` để không commit — nếu cần tra cứu Prisma 7 thì đọc trực tiếp các file này trên máy (không có trên git).

32. **Next.js 16.2.10 đổi tên convention `middleware.ts` → `proxy.ts`.** Vẫn cùng vị trí (`src/proxy.ts` do dự án dùng `src/`), cùng API (default export function, `export const config = { matcher: [...] }`) — chỉ đổi tên file. Để `middleware.ts` vẫn chạy được nhưng log cảnh báo deprecated lúc build (`The "middleware" file convention is deprecated`); đã đổi hẳn sang `proxy.ts` cho sạch log.

33. **⚠️ next-auth v5 (beta) module augmentation PHẢI nhắm đúng `@auth/core/types`/`@auth/core/jwt`, không phải `next-auth`/`next-auth/jwt`.** Tài liệu chính thức hay ghi `declare module "next-auth" { interface Session {...} }`, nhưng bản beta hiện cài (`5.0.0-beta.32`) re-export `Session`/`User`/`JWT` từ `@auth/core` bằng `export type { Session } from "@auth/core/types"` — augment vào `"next-auth"` không merge được vào type gốc mà các callback (`jwt`, `session` trong `auth.config.ts`) thực sự dùng, gây lỗi `Type 'unknown' is not assignable to type 'string'` lúc build. Xem `src/types/next-auth.d.ts` — đã sửa augment thẳng `@auth/core/types` và `@auth/core/jwt`. Nếu nâng cấp next-auth lên bản mới hơn, kiểm tra lại `node_modules/next-auth/index.d.ts`/`jwt.d.ts` xem còn re-export kiểu này không trước khi đổi lại theo docs.

34. **Prisma 7 không tự chạy seed sau `prisma migrate reset`/`migrate dev`** (khác bản cũ) — phải gọi `npx prisma db seed` riêng, một lệnh tách biệt hoàn toàn (xem mục "Cách tiếp tục ở phiên mới" nếu cần seed lại DB dev).

35. **`prisma migrate reset` bị Prisma CLI tự chặn khi phát hiện chạy từ Claude Code**, báo lỗi yêu cầu hỏi ý kiến người dùng trước — đây là tính năng bảo vệ mới của Prisma dành riêng cho AI agent, không phải bug. Chỉ chạy tiếp sau khi chủ dự án xác nhận rõ ràng trong chat, kèm biến môi trường `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION="<nguyên văn câu xác nhận>"`.

36. **Đổi font hiển thị giá tiền (2026-07-28, theo yêu cầu chủ dự án):** `Price.tsx` (dùng ở hầu hết nơi hiện giá) và dòng "Tổng cộng" trong `CartSummary` đổi từ `font-serif` (Cormorant Garamond — nét display, hơi "uốn lượn") sang `font-sans` (thực ra là Lora, xem #25) — nhìn cổ điển/basic hơn, không phải font mới. Tên món/tiêu đề vẫn giữ `font-serif` như cũ, chỉ số tiền đổi. Đồng thời đã thêm `font-variant-numeric: lining-nums tabular-nums` toàn site ở `globals.css` (số thẳng hàng, cùng chiều cao, không dùng oldstyle figures mặc định của font). Cả 2 việc này nằm trên nhánh `fix/numeral-font` (PR #15).

37. **⚠️ Turso (SQLite hosted) không dùng được — CLI không có bản Windows** (chỉ có Darwin/Linux release, không có winget/scoop package). Đổi sang **Neon Postgres** — cũng đúng luôn với kế hoạch gốc PLAN.md Giai đoạn 13, chỉ làm sớm hơn. Cài `neonctl` qua `npx` (gói npm, chạy được trên Windows), login OAuth y hệt flow Vercel CLI trước đó.

38. **Prisma 7 đổi cách khai báo Postgres — không còn `url`/`directUrl` trong `schema.prisma`.** Bản 7 báo lỗi validate nếu để 2 dòng này trong `datasource` block; connection string giờ chỉ khai ở `prisma.config.ts` (dùng cho CLI: migrate/seed) và truyền trực tiếp vào driver adapter lúc runtime (`new PrismaPg(new Pool({connectionString}))`). Đổi từ `@prisma/adapter-libsql` sang **`@prisma/adapter-pg` + `pg`** (theo khuyến nghị chính thức của Prisma cho Postgres, không dùng driver serverless riêng của Neon để tránh thêm dependency không cần thiết). `DATABASE_URL` dùng connection **pooled** (qua PgBouncer, hậu tố `-pooler` trong hostname) cho app runtime — cần thiết vì Vercel serverless có thể mở nhiều connection ngắn hạn cùng lúc; `DIRECT_URL` dùng connection thẳng riêng cho Prisma Migrate (DDL không ổn định qua pooler ở transaction-mode). Xem `prisma/schema.prisma`, `prisma.config.ts`, `src/lib/prisma.ts`.

39. **⚠️ GitHub tự đóng PR khi nhánh base bị xóa.** PR #16 (Giai đoạn 8, base = `feat/gd7-database`) tự chuyển `CLOSED` ngay khi PR #13 được squash-merge + xóa nhánh `feat/gd7-database` — không tự retarget sang `main` được (`gh pr edit --base main` báo lỗi "Cannot change the base branch of a closed pull request", `gh pr reopen` cũng lỗi vì base không còn tồn tại). Cách xử lý: `git rebase origin/main` nhánh con (tự động bỏ qua các commit đã có trong `main` nhờ squash), force-push, rồi `gh pr create` tạo PR MỚI (không tái dùng số PR cũ) nhắm thẳng `main`. PR #16 → thay bằng **PR #17**. Bài học cho các nhánh xếp chồng (stacked PR) sau này: merge nhánh gốc xong, kiểm tra ngay PR con có bị đóng không trước khi tưởng nó vẫn chờ merge bình thường.

40. **⚠️ Vercel CLI tự upload file `.env` cục bộ vào deployment dù `.gitignore` đã chặn** — `.gitignore` chỉ chi phối `git`, không chi phối `vercel` CLI lúc thu thập file để deploy. Log build có dòng cảnh báo "Detected .env file, it is strongly recommended to use Vercel's env handling instead". Không ảnh hưởng chức năng (biến môi trường set qua `vercel env add`/Dashboard vẫn được ưu tiên hơn giá trị trong `.env` bundle, do Next.js không ghi đè `process.env` đã có sẵn), nhưng để `.env` nằm trong source đã deploy là thói quen xấu — đã thêm `.vercelignore` (file mới, nội dung chỉ 1 dòng `.env`) để chặn hẳn.

41. **Sinh dữ liệu lịch sử (Giai đoạn 9) — đã tra cứu benchmark ngành F&B trước khi viết code sinh dữ liệu**, không bịa số tùy tiện:
    - Rating trung bình nhà hàng trên Google Maps ~3.9 sao, mục tiêu "tốt" là >4.25 sao; phân bố lệch dương rõ (chỉ ~2.7% nhà hàng dưới 3.0 sao) — áp dụng trọng số review 55/27/12/4/2 cho 5/4/3/2/1 sao.
    - Tỷ lệ no-show đặt bàn ngành F&B 3.5–20% tùy hệ thống, best-in-class ~3.5% no-show + 11% hủy — dữ liệu sinh ra đạt ~4% no-show, ~11% hủy (khớp gần đúng).
    - Doanh thu cuối tuần cao hơn ngày thường rõ rệt (dẫn chứng: "Average Spend Per Cover" mục tiêu $22 ngày thường / $32 cuối tuần cho fine dining) — áp hệ số theo thứ (`WEEKDAY_MULTIPLIER` trong `prisma/seed-data/calendar.ts`, Thứ 7 = 1.45x, Thứ 2 = 0.65x).
    - Tết Nguyên Đán (29/01/2025, 17/02/2026): nhà hàng thực tế giảm giờ/đóng cửa quanh ngày Tết, cao điểm "tất niên" ~10 ngày trước đó — mô hình hoá bằng hệ số dip 0.15x quanh Tết + boost 1.7x giai đoạn tất niên. Valentine (14/02) và Giáng Sinh (24/25/31-12) cũng là đợt cao điểm riêng.
    - `prisma/seed.ts` sinh theo **từng ngày** trong 574 ngày (01/2025 → hiện tại), nhân hệ số ngày với volume cơ sở, KHÔNG sinh ngẫu nhiên đều — đơn hàng dùng đúng `bestPromotion()` thật của app (không phải số giảm giá giả lập riêng) nên dữ liệu khớp 100% với logic tính tiền thật. Chi tiết: xem `prisma/seed-data/calendar.ts` (hệ số theo ngày), `menu.ts` (thực đơn, chuyển từ `_mock.ts` đã xóa), `names.ts` (sinh tên khách Việt Nam), `review-text.ts` (mẫu câu theo số sao).
    - Đơn hàng/đặt bàn cũ (quá 2 ngày) luôn ở trạng thái cuối (HOÀN THÀNH/ĐÃ HỦY hoặc ĐÃ NHẬN BÀN/ĐÃ HỦY/KHÔNG ĐẾN) — chỉ 1 mẻ nhỏ "top-up" cho hôm nay mới có đủ cả 4 trạng thái đang xử lý (CHỜ XÁC NHẬN/ĐÃ XÁC NHẬN/ĐANG CHUẨN BỊ/ĐANG GIAO), khớp thực tế vận hành (đơn cũ không thể còn "đang chuẩn bị").
    - **`src/lib/data/reviews.ts` dùng `select` tường minh cho quan hệ `user`, không dùng `include: { user: true }`** — `User` model có cột `password` (bcrypt hash), `include` thẳng sẽ trả nguyên object User (kèm hash) ra tận client qua props của `ReviewList`/`ReviewsPreview`. Đây là quy tắc chung: **bất kỳ chỗ nào populate quan hệ tới `User` cho client đều phải `select` tường minh**, không `include: true`.

42. **Giai đoạn 10 (Review) — 2 quyết định khác PLAN.md tối thiểu (đã thống nhất với chủ dự án trước khi code):**
    - **Điều kiện viết review là "verified purchase"**, không chỉ cần đăng nhập như PLAN.md ghi tối thiểu — `createReview` (`src/lib/actions/review.ts`) check `OrderItem` có `dishId` tương ứng thuộc 1 `Order` của user với `status === "COMPLETED"` (hàm `getHasPurchasedDish` trong `src/lib/data/orders.ts`). Nếu sau này muốn nới lỏng lại thành "chỉ cần đăng nhập", bỏ đoạn check `purchased` trong `createReview` và bỏ tham số `canReview` truyền vào `ReviewSection`.
    - **`useOptimistic` áp dụng cho cả sửa/xóa, không chỉ tạo mới** (PLAN.md chỉ ghi "review hiện ngay" cho tạo) — `ReviewSection` (`src/components/review/review-section.tsx`) dùng 1 reducer chung (`add`/`update`/`remove`) cho cả 3 thao tác, gọi `router.refresh()` sau khi Server Action trả `success` để đồng bộ lại đúng dữ liệu server (avgRating tính client-side từ mảng review hiện có, không đọc `dish.avgRating` — luôn khớp vì cùng công thức trung bình cộng).
    - Sửa/xóa review của chính mình xóa **ngay, không có confirm dialog** — khớp pattern admin hiện có (`dishes-table.tsx` cũng xóa ngay không confirm), đánh dấu bằng comment `ponytail:` trong code. Muốn thêm confirm thì bọc quanh lời gọi `submitDelete` trong `ReviewSection`.
    - **Đã verify bằng browser thật** (Chrome extension nối lại được ở phiên tiếp theo, khác #25) — tạo/sửa/xóa review qua UI thật, optimistic UI hiện đúng, avgRating/reviewCount cập nhật đúng, nút "Viết Đánh Giá" ẩn/hiện đúng theo điều kiện.

43. **Giai đoạn 11 (Admin backend, đang làm dở) — 2 phát hiện khi wiring CRUD thật:**
    - **`DishFormDialog`/`PromotionFormDialog` (thời mock, Giai đoạn 6) thiếu input cho một số trường có sẵn trong schema/type** — `Dish`: `isFeatured`, `hasDoneness`, `weightGram` (form cũ chỉ có tên/giá/danh mục/mô tả/ảnh, 3 trường kia âm thầm giữ nguyên giá trị cũ hoặc mặc định, không sửa được qua UI). `Promotion`: `badgeLabel`, `badgeOffer`, `scheduleText`, `startDate`, `endDate` (badge hiển thị trên `PromoCard` không có cách nào sửa qua admin UI cũ). Đã bổ sung đầy đủ input khi viết lại 2 dialog này sang gọi Server Action thật — không phải scope creep, mà là sửa 1 gap thật (nếu không, tạo khuyến mãi mới qua admin sẽ ra badge rỗng).
    - **Mục "Stat" của Giai đoạn 11 (doanh thu tháng, số đơn, booking hôm nay, món bán chạy) thực ra đã xong từ Giai đoạn 9** (`src/lib/data/analytics.ts`, hiển thị ở `admin/page.tsx`) — sớm hơn dự tính PLAN.md, giống pattern Postgres/dashboard đã làm sớm trước đó. Không cần làm lại khi tiếp tục Giai đoạn 11.
    - `src/lib/auth/require-admin.ts` (`requireAdminSession()`) là helper dùng chung mới — mọi Server Action admin sau này (đổi trạng thái đơn/đặt bàn, upload ảnh...) nên gọi hàm này thay vì tự viết lại check `role === "ADMIN"`.

44. **⚠️ Đã xóa `CLAUDE.md`/`AGENTS.md` khỏi repo và dọn sạch mọi nhắc đến "Claude" trên GitHub, theo yêu cầu chủ dự án** (contributor chỉ muốn có mình chủ dự án):
    - Xóa hẳn `CLAUDE.md`, `AGENTS.md` ở root — **đừng tự tạo lại** 2 file này (kể cả khi `prisma init`/`shadcn add`/công cụ khác tự sinh ra, xem "Sai khác" #31 — file đó nằm trong `.gitignore` nên không commit, không liên quan file đã xóa ở đây).
    - Viết lại toàn bộ lịch sử `main` (qua `git filter-branch`, force-push) để xóa dòng `Co-Authored-By: Claude Sonnet 5` khỏi 1 commit squash-merge cũ + sửa mô tả 12 PR đã merge để xóa dòng "🤖 Generated with Claude Code" — **không phải thao tác cần lặp lại**, chỉ ghi để hiểu vì sao lịch sử git commit hash khác với những gì đã thấy trước đó nếu có clone cũ.
    - Quy tắc áp dụng **từ giờ về sau**: không thêm `Co-Authored-By: Claude` vào bất kỳ commit mới nào (xem mục "Quy trình git" đầu file) — nếu công cụ AI đang dùng tự động thêm dòng này theo mặc định, phải chủ động bỏ nó đi trước khi commit.
    - **⚠️⚠️ Rewrite ở trên KHÔNG dọn được hết — GitHub vẫn hiện `claude` là contributor thứ 2 (phát hiện 2026-07-30).**

      **Gốc rễ: `git filter-branch` chỉ viết lại `main`, còn GitHub lưu mỗi pull request thành một ref riêng `refs/pull/<số>/head` trỏ vào commit GỐC trước khi rewrite, và giữ vĩnh viễn.** Fetch về kiểm (`git fetch origin '+refs/pull/*/head:refs/remotes/pr/*'`) thì **PR #11 → #21 đều còn dòng `Co-Authored-By: Claude Sonnet 5`**. `refs/pull/*` là read-only phía server — không xoá được bằng bất kỳ lệnh git nào, rewrite/force-push đều không đụng tới.

      **Vì sao dễ kết luận nhầm là đã sạch** (đã mắc đúng bẫy này một lần, đừng lặp lại):
      - `gh api .../contributors` → chỉ `hungknh`. **API này chỉ đếm _author_, không đếm _co-author_.**
      - Insights → Contributors → chỉ `hungknh`. Trang này chỉ tính "contributions to main".
      - `/commits/main?author=claude` → "There isn't any commit history to show here". Cũng chỉ soi `main`.
      - `git log origin/main` → 0 trailer. Đúng, nhưng `main` không phải toàn bộ repo.
      - **Chỉ có widget "Contributors" ở sidebar trang chủ repo mới lộ ra.** Muốn kiểm nhanh: mở `https://github.com/<user>/<repo>` rồi đọc mục Contributors ở cột phải.

      **Kết luận: cách duy nhất dứt điểm là xoá repo rồi tạo lại và push `main` sang.** `main` hiện tại đã sạch 100% (84 commit, 0 trailer) nên không phải dựng lại lịch sử — push nguyên là được. Đánh đổi: mất toàn bộ PR kèm mô tả, lịch sử Actions, lịch sử deployment; phải nối lại Vercel ↔ GitHub (#54) và sửa các link PR chết trong `README.md`/`PROGRESS.md`.

      Ngoài ra trên máy local còn `refs/original/refs/heads/main` (backup do `filter-branch` tạo) cũng chứa dòng này — chưa bao giờ được push. Dọn bằng: `git update-ref -d refs/original/refs/heads/main && git reflog expire --expire=now --all && git gc --prune=now`.

45. **Upload ảnh UploadThing — CẮT khỏi phạm vi (quyết định chủ dự án, 2026-07-30).** Không tạo tài khoản UploadThing. Admin nhập URL ảnh thủ công vào field `imageUrl` như hiện tại (`DishFormDialog`/`PromotionFormDialog` đã có input này). Giai đoạn 11 tính là **Xong**. Nếu sau này muốn làm: cài `uploadthing` + `@uploadthing/react`, thêm route `src/app/api/uploadthing/route.ts`, đổi input `imageUrl` trong 2 dialog thành `<UploadButton>`, gọi `requireAdminSession()` trong middleware của file router (xem #43).

46. **Playwright (3 luồng E2E) — CẮT khỏi phạm vi (quyết định chủ dự án, 2026-07-30).** Lý do: dự án ở quy mô portfolio/CV, không cần hạ tầng test browser ~300MB. Thay bằng: **Vitest 11 file / 66 test** (discount engine, tính tiền giỏ, `cartItemKey`, `formatVND`/`formatDaysOfWeek`, 5 schema Zod, table-utils, time-slots) + **GitHub Actions chạy lint → test → build mỗi push**. Nếu sau này muốn thêm E2E: `npm i -D @playwright/test && npx playwright install chromium`, và trong CI phải seed DB trước (job hiện tại chỉ `migrate deploy`, DB rỗng nên không đủ dữ liệu để E2E chạy).

47. **Giai đoạn 12 — SEO đọc thông tin nhà hàng từ `src/lib/site.ts` (file mới), KHÔNG hard-code rải rác.** Địa chỉ/SĐT/email/giờ mở cửa trong file này phải khớp với những gì `src/components/layout/footer.tsx` hiển thị — sửa 1 chỗ thì sửa cả 2 (chưa refactor Footer đọc từ `SITE` vì Footer còn layout icon riêng, không phải chỉ text). `SITE.url` ưu tiên `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → fallback `https://beefsteakhouse.vercel.app`, nên bản preview Vercel tự có canonical đúng của chính nó.

48. **⚠️ `src/app/sitemap.ts` phải `export const dynamic = "force-dynamic"`.** Sitemap đọc DB (danh sách món + khuyến mãi đang bật). Mặc định Next sinh sitemap **lúc build** → (1) `next build` sẽ cần `DATABASE_URL` thật, CI với Postgres rỗng/không có DB sẽ vỡ, (2) món thêm sau khi deploy không xuất hiện trong sitemap cho tới lần deploy kế tiếp. Với `force-dynamic`, route `/sitemap.xml` thành `ƒ (Dynamic)` (kiểm bằng bảng route ở cuối `npm run build`) — đã verify 24 URL sinh đúng từ DB thật.

49. **JSON-LD chỉ phát ở 2 chỗ, có lý do:** `Restaurant` đặt ở `src/app/(public)/layout.tsx` (hiện trên mọi trang khách, không lặp lại từng page); `Menu` chỉ đặt ở `/thuc-don` **và chỉ khi không lọc danh mục** — bản `?category=...` là tập con của thực đơn, khai báo nó như toàn bộ `Menu` là sai dữ liệu với Google. Giá trong `MenuItem.offers` là **giá gốc** `dish.price`, không phải giá sau khuyến mãi: khuyến mãi phụ thuộc ngày/giờ/giỏ hàng (`bestPromotion()`) nên không biểu diễn tĩnh được. Component `JsonLd` (`src/components/shared/json-ld.tsx`) tự escape `<` thành `<` — `JSON.stringify` không escape ký tự này, nếu tên món/mô tả có `<` thì thẻ `<script>` bị phá.

50. **`src/app/error.tsx` + `src/app/not-found.tsx` ở root nên KHÔNG có Header/Footer** (hệ quả trực tiếp của #12: Header/Footer nằm ở `(public)/layout.tsx`, không phải root). Vì vậy 2 trang này tự có nút "Về Trang Chủ"/"Xem Thực Đơn" thay cho nav. **Không thêm `global-error.tsx`** — nó chỉ cần khi chính root layout ném lỗi, mà root layout ở đây chỉ có font + `SessionProvider`, không fetch dữ liệu (đã ghi comment `ponytail:` trong `error.tsx`). `error.tsx` hiện chỉ `console.error`, chưa nối dịch vụ log lỗi (Sentry...) — chỗ nối nếu cần là `useEffect` trong file đó.

51. **Rate limit đặt bàn = đếm trong DB, không dùng store ngoài** (`createReservation` trong `src/lib/actions/reservation.ts`, hằng số `MAX_RESERVATIONS_PER_PHONE_PER_DAY = 3`). 2 chi tiết quan trọng: (1) hạn mức tính theo **cặp (SĐT, ngày đặt bàn)**, không phải theo ngày tạo đơn; (2) đơn `CANCELLED` **không** tính vào hạn mức — khách hủy rồi đặt lại giờ khác là hành vi bình thường, không phải spam. Đã verify bằng script tạm chạy trên Neon thật (tạo 3 đơn số test `0900000099` → đếm ra 3, hủy 1 → đếm ra 2, khác ngày → 0, rồi xóa sạch); script không commit vì chỉ dùng 1 lần. Lỗi trả về hiển thị qua `formError` sẵn có trong `reservation-form.tsx`, không cần sửa UI.

52. **CI (`.github/workflows/ci.yml`) tự dựng Postgres 17 trong container, KHÔNG dùng Neon thật.** Lý do: không cần GitHub secret (PR từ fork vẫn chạy được) và CI không có cách nào ghi bẩn vào dữ liệu demo. Job: `npm ci` (tự `prisma generate` qua postinstall, xem #30) → `prisma migrate deploy` (đồng thời kiểm migrations còn áp được sạch) → `lint` → `test` → `build`. `AUTH_SECRET` đặt giá trị giả ngay trong file YAML vì next-auth đòi biến này lúc build — không phải secret thật, đừng "sửa cho an toàn" bằng cách chuyển sang GitHub Secrets, sẽ làm fork PR vỡ. Lưu ý: **build hiện không cần DB** (mọi page đọc DB đều `force-dynamic` hoặc có searchParams), Postgres trong CI chỉ để `migrate deploy` chạy được.

53. **`npx prettier --check src/**` báo lỗi ở 105 file — đây là trạng thái sẵn có của repo, không phải do Giai đoạn 12.** `.prettierrc.json` không set `printWidth` nên Prettier dùng mặc định 80, còn code trong repo viết theo ~100 cột. Prettier **không** nằm trong `npm run lint` hay CI, nên sai khác này không làm gì vỡ. Đừng chạy `prettier --write` toàn repo để "dọn" — sẽ tạo 1 diff khổng lồ vô nghĩa; nếu thật muốn thống nhất thì thêm `"printWidth": 100` vào `.prettierrc.json` trước, rồi mới format, và làm ở 1 commit `chore:` riêng.

54. **✅ Đã nối GitHub ↔ Vercel (2026-07-30) — "Sai khác" #26 KHÔNG còn đúng nữa.** Repo `hungknh/BeefSteakRestaurant` giờ connected trong Vercel project `hung-dfd0/beefsteakhouse`, Production branch = `main`. **Mỗi push lên `main` tự deploy production**, không cần `npx vercel --prod --yes` nữa — và đừng dùng lệnh đó nữa vì nó bỏ qua git + upload kèm `.env` cục bộ (xem #40).

    **Cả 3 env var (`AUTH_SECRET`, `DATABASE_URL`, `DIRECT_URL`) giờ bật cho cả Production + Preview** — cần thiết vì mỗi PR sinh 1 Preview deployment, không có DB thì Preview build được nhưng chết lúc chạy. Kiểm bằng `npx vercel env ls` (nguồn độc lập với UI).

    **⚠️ Đọc trước khi sửa env var Sensitive lần sau:** cả 3 biến đều bật cờ **Sensitive**, nghĩa là Vercel **không gửi giá trị về browser** — mở form Edit thì ô Value **rỗng thật** (`document.querySelector('textarea').value` → `''`; chữ mờ nhìn thấy chỉ là placeholder kiểu `postgres://user:pass@db.example.com:5432/app`). Trông như sắp ghi rỗng lên secret, nhưng **không phải**: Save với ô Value để trống thì Vercel **giữ nguyên giá trị cũ**, chỉ cập nhật danh sách environment. Đã xác minh chứ không đoán — sau khi sửa `AUTH_SECRET` rồi deploy lại, `GET /api/auth/csrf` trả 200 kèm token (next-auth ký được ⇒ secret còn nguyên), trang `/thuc-don` vẫn ra tên món thật từ Neon (⇒ `DATABASE_URL` còn nguyên). Lưu ý `npx vercel env pull` **không dùng để kiểm việc này được** — nó trả `"[SENSITIVE]"` cho mọi biến sensitive, không phân biệt còn giá trị hay đã rỗng.

    Cũng đừng bấm toggle **Sensitive** trong form Edit "cho chắc": nó **đang bật** dù nhìn như tắt (kiểm bằng `document.querySelector('input[name=edit-form-sensitive]').checked` → `true`), bấm vào là tắt mất.

    Một điểm quan trọng: **thay đổi env không ảnh hưởng deployment đang chạy** — Vercel chỉ áp env mới ở lần deploy kế tiếp. Muốn env mới có hiệu lực thì phải deploy lại (giờ chỉ cần push lên `main`).

55. **⚠️ Giai đoạn 14 phát hiện bug thật: nav có "Liên Hệ" → `/lien-he` nhưng trang chưa bao giờ được tạo, production trả 404.** `NAV_ITEMS` (`src/components/layout/nav-items.ts`) liệt kê 5 mục từ Giai đoạn 1, nhưng `lien-he` bị bỏ sót suốt 13 giai đoạn — Header và Footer đều render link này nên nhà tuyển dụng bấm nav là gặp trang lỗi. Đã tạo `src/app/(public)/lien-he/page.tsx`: trang tĩnh đọc hết từ `SITE` (`src/lib/site.ts`), thêm vào `sitemap.ts`, `robots.ts` không chặn. **Cố tình KHÔNG có form gửi liên hệ** — chưa nối dịch vụ email nào, form bấm xong không gửi đi đâu thì tệ hơn là không có form (đã ghi comment `ponytail:` trong file). Muốn thêm thì cắm Resend vào một Server Action mới, **đừng dùng `mailto:`** (mở app mail của khách, hay hỏng). Bài học: khi thêm mục vào `NAV_ITEMS`, kiểm luôn route tương ứng có tồn tại không.

56. **Tài khoản khách để demo là `hang.do@example.com` / `password123` — chọn từ dữ liệu seed có sẵn, KHÔNG tạo user mới.** Lý do: email khách do `generateCustomers()` sinh random nên không có email cố định nào để ghi vào README, mà tài khoản đăng ký mới thì trắng lịch sử và **không viết được đánh giá** (cần đơn `COMPLETED` chứa món đó, xem #42). Đã truy vấn DB chọn khách có lịch sử đẹp nhất: 15 đơn hoàn thành, 8 đặt bàn, 5 đánh giá. **Nếu seed lại DB thì email này đổi** (random theo seed) — phải truy vấn lại và sửa README, nếu không nhà tuyển dụng đăng nhập sẽ lỗi. Câu truy vấn: `groupBy` trên `Order` theo `userId` với `status: "COMPLETED"`, sắp giảm dần theo `_count`.

57. **README đã viết lại hoàn toàn (Giai đoạn 14) — bản cũ vẫn còn nguyên boilerplate `create-next-app`** (kể cả đoạn quảng cáo font Geist mà dự án không dùng). Bản mới: link demo, bảng 2 tài khoản dùng thử, 5 screenshot, tech stack, bảng số liệu dữ liệu, **sơ đồ DB bằng Mermaid `erDiagram`** (GitHub render sẵn, không cần ảnh), và 3 vấn đề khó nhất theo yêu cầu PLAN.md. Số liệu trong README lấy từ **truy vấn DB thật** chứ không copy số cũ trong file này — đặt bàn thực tế là **457** chứ không phải 460 như phần đầu file từng ghi. Nếu sửa số liệu thì truy vấn lại, đừng chép chéo giữa 2 file.

58. **Giai đoạn 15: chỉ làm i18n Việt/Anh. Đã CẮT 3 mục còn lại** (quyết định chủ dự án, 2026-07-30): VNPay/Momo sandbox (cần tự đăng ký merchant), **email xác nhận Resend** (không có custom domain thì Resend chỉ gửi được tới email của chính chủ tài khoản → nhà tuyển dụng thử sẽ không nhận được gì, tính năng trông như hỏng), Blog/CMS (giá trị CV thấp nhất, không thể hiện thêm kỹ năng nào so với CRUD món/khuyến mãi đã có).

59. **⚠️ i18n bắt buộc chuyển toàn bộ route vào `app/[locale]/` — không phải để cho gọn.** `<html lang>` phải đổi theo ngôn ngữ, mà root layout là chỗ duy nhất render `<html>`, nên root layout phải biết locale ⇒ nó phải nằm trong `[locale]`. Hệ quả: **không còn `app/layout.tsx`**, root layout thật là `app/[locale]/layout.tsx`. `admin` cũng nằm trong `[locale]` (để có `<html>`), nhưng **chuỗi admin giữ tiếng Việt** — công cụ nội bộ, dịch nó gần như gấp đôi khối lượng mà không thêm giá trị CV. `robots.ts`/`sitemap.ts` ở lại `app/` (không phải page, không cần `<html>`; matcher của proxy loại trừ path có dấu chấm nên chúng không bị redirect locale).

    **Đường dẫn KHÔNG dịch**: `/en/thuc-don` chứ không phải `/en/menu`. next-intl làm được (`pathnames`) nhưng thêm một tầng cấu hình cho lợi ích nhỏ.

    **Xoá `.next` khi đổi cấu trúc route.** Type cache cũ gây lỗi trông như lỗi code: `Type '"/"' is not assignable to type 'LayoutRoutes'` ở `.next/dev/types/validator.ts`. `rm -rf .next tsconfig.tsbuildinfo` là hết.

60. **⚠️⚠️ Truyền handler vào `auth(...)` làm MẤT lớp chặn route — hồi quy nghiêm trọng đã gặp và sửa.** Trước i18n, `proxy.ts` là `NextAuth(authConfig).auth` (dạng "trần"); ở dạng đó next-auth tự đọc `callbacks.authorized` rồi tự redirect. Nhưng khi xếp chồng với middleware i18n phải viết `auth((req) => intlMiddleware(req))`, và **ở dạng có handler thì next-auth KHÔNG đọc `authorized` nữa** — handler chịu trách nhiệm hoàn toàn. Kết quả: `/admin` trả **HTTP 200 cho khách chưa đăng nhập**. Phát hiện được vì so với production (`307 -> /dang-nhap`) chứ build/lint/test đều xanh.

    Đã chuyển việc chặn route vào chính `proxy.ts` (đọc `req.auth` tường minh) và **xoá `callbacks.authorized`** khỏi `auth.config.ts` — để lại thì nó là code chết trông như đang bảo vệ route. Nhân đó sửa luôn lỗi sẵn có: `pages.signIn` của next-auth là đường dẫn cứng nên khách xem bản tiếng Anh bị đẩy về trang đăng nhập tiếng Việt; giờ về `/en/dang-nhap`.

    Nhắc lại: middleware chỉ là lớp UX. Lớp bảo vệ thật vẫn là `requireAdminSession()` trong từng Server Action (#43) — đừng bỏ vì đã có middleware.

61. **⚠️ Dùng `Link`/`useRouter`/`usePathname` từ `@/i18n/navigation`, KHÔNG từ `next/link`/`next/navigation`** cho điều hướng nội bộ. Bản của next-intl tự thêm prefix locale; bản gốc thì không, nên đang ở `/en/...` mà bấm link là rơi về tiếng Việt. Đã đổi 18 file. Ngoại lệ hợp lệ: `router.refresh()` (không liên quan locale, 5 file admin/review giữ `next/navigation`), `notFound()`, và `app/not-found.tsx` ở root (nằm ngoài `[locale]` nên không có ngữ cảnh locale). Trong `login-form.tsx` phải `stripLocale(callbackUrl)` trước khi push vì callbackUrl do next-auth sinh đã chứa prefix — không bỏ thì ra `/en/en/tai-khoan`.

62. **⚠️⚠️ `next-intl@4.13.4` gây lock file không hội tụ — `npm ci` liên tục báo "Missing: … from lock file".** Đây là chỗ tốn thời gian nhất của giai đoạn này, đọc kỹ trước khi nâng/thêm dependency.

    Gốc rễ: `next-intl@4.13.4` **không phải thư viện thuần runtime** — nó phụ thuộc cứng vào `@swc/core`, `@parcel/watcher`, `next-intl-swc-plugin-extractor`, `po-parser`, `icu-minify` (kiểm bằng `npm view next-intl dependencies`). Hai gói đầu có native binary. `@swc/core` đòi `@swc/helpers >=0.5.17` còn `next@16.2.10` ghim đúng `0.5.15` ⇒ cây phụ thuộc vào trạng thái `invalid`, và npm ghi lock **thiếu các bản lồng trùng version**.

    Triệu chứng đặc trưng: mỗi lần sinh lại lock thì `npm ci` báo thiếu gói KHÁC (`@swc/helpers@0.5.23`, rồi `ajv@6.15.0` + `json-schema-traverse@0.4.1` — deps lồng của eslint). Lock không bao giờ hội tụ.

    Những cách **KHÔNG** sửa được (đã thử, đừng thử lại): `npm install` thường (node_modules đã "đủ" nên npm không tính lại lock); `npm install --package-lock-only`; `rm -rf node_modules package-lock.json && npm install`. Lưu ý `npm ci` **xoá node_modules trước rồi mới fail**, nên sau một lần fail thì repo không còn node_modules.

    Cách kiểm nhanh mà không phải chờ CI: `npm ci --dry-run`. **Đừng `| tail -n`** — dòng `Missing:` nằm ở đầu output, `tail` cắt mất đúng thông tin cần.

    **Nhưng gốc rễ cuối cùng KHÔNG phải next-intl** — sau khi `npm cache clean --force` + sinh lại lock thì `@swc/helpers` hết, chỉ còn `ajv`. Nguyên nhân thật: **`eslint` cần `ajv ^6.12.4`, `@hookform/resolvers` cần `ajv ^8.12.0`**. Dòng ajv 6 đứng yên ở 6.12.6 từ 2020, nhưng **6.14.0 và 6.15.0 được phát hành 02/2026 và 04/2026** — npm giờ hoist `ajv@6.15.0` lên root, đúng chỗ `@hookform/resolvers` tìm, nên thành `invalid` và npm ghi lock thiếu các bản lồng.

    ⚠️ **Bài học đắt nhất: lock cũ trên `main` vẫn chạy tốt, chính việc sinh lại lock đã làm hỏng.** Xung đột có sẵn từ trước, chỉ lộ ra khi lock được tính lại từ đầu. Lần sau gặp `npm ci` báo thiếu 1 gói: **đừng xoá lock để sinh lại** — thử thêm đúng entry còn thiếu, hoặc `overrides`, trước khi phá lock đang hoạt động.

    Xử lý cuối cùng: **đổi bước CI từ `npm ci` sang `npm install --no-audit --no-fund`** (xem comment dài trong `.github/workflows/ci.yml`). Không ảnh hưởng runtime — chỗ duy nhất cần ajv là `ajvResolver` của `@hookform/resolvers`, mà dự án dùng `zodResolver`; lint/test/build đều xanh. Đánh đổi: CI có thể cài transitive mới hơn lock, mất tính tái lập tuyệt đối; vẫn bắt được hồi quy lint/test/build. Quay lại `npm ci` khi upstream sửa.

63. **Dịch nội dung DB (Giai đoạn 15, PR2): thêm cột `*En` nullable, KHÔNG tạo bảng dịch riêng.** `Category.nameEn`, `Dish.nameEn/descriptionEn`, `Promotion.titleEn/descriptionEn/badgeLabelEn/badgeOfferEn/scheduleTextEn`. Chỉ 2 ngôn ngữ và số bản ghi nhỏ (25) nên bảng translation riêng là over-engineer. Migration `20260730044550_add_english_content_fields` thuần `ADD COLUMN ... TEXT`, không sửa/xoá dữ liệu.

    **KHÔNG dịch, có chủ đích:** `slug` (nằm trong URL + sitemap, đổi là hỏng link cũ), `Review.content` (khách viết — giữ nguyên ngôn ngữ gốc mới đúng thực tế).

    **Đọc nội dung qua helper `src/lib/i18n-content.ts`, đừng đọc thẳng `dish.nameEn`.** Helper **luôn rơi về tiếng Việt** khi bản dịch `null` HOẶC chuỗi rỗng — quan trọng vì form admin lưu ô để trống thành `""` chứ không phải `null`, và món admin mới tạo có thể chưa dịch. Hiện tên tiếng Việt vẫn tốt hơn hiện ô trống.

    Tầng `lib/data/` **không** biết locale (nó chỉ truy vấn) — chọn ngôn ngữ lúc render. Server Component async dùng `getLocale()` từ `next-intl/server`; component sync/client dùng hook `useLocale()`. Dùng sai loại là lỗi runtime.

64. **⚠️ Bản dịch nằm ở `prisma/seed-data/menu-en.ts`, tách khỏi `menu.ts`, và có test canh.** Thêm món/khuyến mãi mới vào `menu.ts` mà quên bản dịch thì **UI không vỡ** (tự rơi về tiếng Việt) nên không ai phát hiện — `menu-en.test.ts` bắt việc đó, cùng với bản dịch mồ côi (id không còn tồn tại) và bản dịch rỗng.

    Một test trong đó kiểm "bản dịch còn sót dấu tiếng Việt". Regex **chỉ liệt kê dấu riêng của tiếng Việt**, cố ý bỏ dấu dùng chung với tiếng Pháp/Latin-1 (à á â è é ê ì í ò ó ô ù ú û ý...) — bản đầu bắt sai "Crème Brûlée" là tên tiếng Anh hợp lệ. Đừng "sửa cho đủ dấu".

65. **Dữ liệu đang có trên Neon được điền bản dịch bằng `prisma/backfill-en.ts`, KHÔNG seed lại.** `prisma db seed` xoá sạch rồi sinh lại — mất 632 đơn + 457 đặt bàn + 113 đánh giá của bản demo (và bị Prisma chặn khi chạy từ AI agent, xem #35). Script chỉ `updateMany` các cột `*En` theo id, an toàn chạy lại nhiều lần, và cuối cùng in ra bản ghi nào trong DB còn thiếu bản dịch. Đã chạy: 5 danh mục + 15 món + 5 khuyến mãi. Chạy lại: `npx tsx prisma/backfill-en.ts`.

66. **Form admin có ô nhập bản dịch (không bắt buộc).** Phải map DB → form qua `toFormValues()` trong `dish-form-dialog.tsx`/`promotion-form-dialog.tsx`: cột `*En` nullable trong DB nhưng input HTML cần `string`, nhồi `null` vào `value` làm input thành uncontrolled và React cảnh báo. Schema Zod dùng `z.string().trim()` (cho phép `""`) chứ **không** `.optional()` — input HTML luôn gửi `""` khi bỏ trống, `.optional()` sẽ không khớp. Fixture test của `dish.test.ts`/`promotion.test.ts` đã cập nhật theo, kèm 2 test mới kiểm "để rỗng vẫn pass".

67. **⚠️⚠️ RÀ SOÁT LOGIC (2026-07-30) — 6 lỗi thật, đọc kỹ vì đều là loại lint/build KHÔNG bắt được.**

    **(a) `createOrder` không validate mảng `items` từ client — nghiêm trọng nhất.** Chỉ `values` được Zod kiểm, còn `items` (dishId/quantity/doneness/note) nhận nguyên. **Type TypeScript bị xoá lúc runtime**, Server Action nhận dữ liệu qua network nên `quantity: number` không chặn gì. Đã kiểm bằng chính hàm thật: `quantity: -10` cho `subtotal = -1.000.000` → tạo được đơn có total âm. Đúng lỗ hổng PLAN.md mục 6 yêu cầu chặn — server tính lại **giá** từ DB nhưng tin **số lượng** của client. Fix: `orderItemsSchema` trong `validations/order.ts`. **Bài học chung: mọi tham số của Server Action đều phải validate, không chỉ cái trông giống "form".**

    **(b) Rò rỉ email khách ra trang công khai.** `getReviews` dùng `select` (đúng, tránh lộ hash mật khẩu như #41 dặn) nhưng liệt kê thừa `email`/`role`. Trang món là trang công khai nên mọi field đi vào RSC payload trong HTML — đã kiểm: **1 trang lộ 10 email**, quét hết trang là gom gần hết 71 người dùng. Fix 2 lớp: thu hẹp `select` còn `name`, **và** đổi type thành `ReviewAuthor = { name: string }` để `review.user.email` **không biên dịch được** nữa. Nhớ: `select` hẹp thôi chưa đủ, phải để type chặn giúp.

    **(c) `doneness` không kiểm theo `hasDoneness`** — lưu được "Tiramisu — Chín Kỹ". Server tự bỏ khi món không hỗ trợ.

    **(d) Đặt bàn nhận ngày quá khứ + khung giờ tự do.** `<input type="date" min={today}>` là thuộc tính HTML, **chỉ chặn client**. Fix: `isBookingDateAllowed()` trong `reservation/time-slots.ts` (nhận `now` qua tham số để test được, cùng nguyên tắc `bestPromotion`) + `timeSlot: z.enum(TIME_SLOTS)` + `date` kiểm định dạng. ⚠️ Đổi `timeSlot` sang enum làm `defaultValues.timeSlot: ""` hết hợp lệ — dùng `undefined` cho trạng thái "chưa chọn".

    **(e) Mã đơn trùng khi 2 đơn tạo đồng thời** → P2002 không bắt → khách thấy trang lỗi. Fix: `createOrderWithRetry`.

    **(f) `total` tính bằng 2 công thức khác nhau** ở `computeCartTotals` (có kẹp 0) và `createOrder` (không kẹp). Hiện trùng số nhưng sửa engine một bên là lệch tiền. Server giờ dùng chung `computeCartTotals`.

68. **Bộ dò "còn tiếng Việt trên trang /en" — cách verify i18n đáng tin nhất.** curl các trang `/en`, bỏ `<script>` (RSC payload chứa dữ liệu gốc, không phải chữ hiển thị), strip thẻ, rồi tìm **dấu riêng của tiếng Việt** (bỏ dấu dùng chung với tiếng Pháp — nếu không sẽ báo sai ở "Crème Brûlée"). Kết quả: **197 → 0** chuỗi UI.

    ⚠️ **Mục tiêu KHÔNG phải 0 tuyệt đối.** Có 3 nhóm **cố ý** giữ tiếng Việt, phải loại trừ khi đếm: (1) địa chỉ nhà hàng "12 Lê Lợi, Quận 1, TP. Hồ Chí Minh" — danh từ riêng, hiện ở Footer mọi trang; (2) tên người đánh giá; (3) nội dung đánh giá khách viết. Cũng nhớ tên món tiếng Việt vẫn nằm trong RSC payload (props truyền xuống client) — **không phải lỗi hiển thị**, đã kiểm `Sườn Bò Nướng` xuất hiện 0 lần trong text render.

69. **`computeCartTotals` trả về object `promotion`, KHÔNG phải `promotionTitle`.** Trả mỗi title thì đó luôn là bản tiếng Việt, nên dòng "Ưu đãi: …" trong giỏ hàng hiện tiếng Việt ngay ở bản tiếng Anh. Có object thì chỗ hiển thị tự gọi `promoTitle(promotion, locale)`. Ngược lại, `appliedPromotionTitle` lưu trong `Order` **cố ý giữ bản tiếng Việt** — đó là snapshot lịch sử, không phải chữ trên UI (cùng lý do `PICKUP_ADDRESS`).

70. **Giai đoạn 13 (Deploy production) — đối chiếu từng gạch đầu dòng của PLAN.md.** Trước đây bảng trạng thái ghi "🔶 Một phần, còn lại custom domain", nhưng custom domain **không nằm trong checklist PLAN.md** và chủ dự án đã quyết định không dùng (domain `*.vercel.app` là đủ cho quy mô CV). Đối chiếu thật:

    | Yêu cầu PLAN.md | Trạng thái |
    |---|---|
    | Neon project → `DATABASE_URL` | ✅ làm sớm ở Giai đoạn 9 (#37–#38) |
    | `provider` sang `postgresql`, migrate lại | ✅ (#38) |
    | Seed lên Neon | ✅ 632 đơn + 457 đặt bàn + 113 đánh giá (#41) |
    | Vercel env `DATABASE_URL`, `AUTH_SECRET` | ✅ cả Production + Preview (#54) |
    | Vercel env `AUTH_GOOGLE_ID/SECRET` | ❌ **không set, có chủ đích** — provider Google khai trong `src/auth.ts` nhưng UI đăng nhập không có nút Google nên không ai gọi tới. Muốn bật thì thêm nút vào form đăng nhập rồi mới cần 2 biến này. |
    | Vercel env `UPLOADTHING_TOKEN` | ❌ **không set, có chủ đích** — tính năng upload ảnh đã cắt (#45) |
    | `prisma generate` trước `next build` | ✅ làm bằng `postinstall` thay vì sửa script `build` (#30) |
    | Tài khoản demo cho nhà tuyển dụng | ✅ admin + tài khoản khách có lịch sử thật (#56) |

    Làm thêm ngoài checklist: nối GitHub ↔ Vercel để mỗi push tự deploy (#54), và bật env cho môi trường Preview.

71. **Search server-side cho `/admin/orders` + `/admin/reservations` (2026-07-30) — gỡ đánh đổi ghi ở đầu file.** Ô tìm kiếm giờ query thẳng DB qua `searchParams.q`, không còn lọc trong 20 dòng của trang hiện tại. `getOrdersPaged(page, q)` tìm theo `code` + `receiverName`, `getReservationsPaged(page, q)` theo `guestName` — đúng phạm vi search client-side cũ, không mở rộng thêm cột.

    **⚠️⚠️ `<form action="">` — dấu `action` rỗng là BẮT BUỘC, đừng dọn đi cho gọn.** Viết `<form>` không có `action` thì **React 19 nuốt luôn sự kiện submit**: sự kiện `submit` vẫn bắn, `defaultPrevented` đọc ở listener cấp form vẫn `false` (listener của React gắn ở root nên chạy SAU), nhưng trình duyệt không điều hướng — cả phím Enter lẫn nút "Tìm" đều im lặng không làm gì. Thêm `action=""` (= URL hiện tại) là hết. **Lint, `npm test`, `next build` đều xanh với bản hỏng** — chỉ browser thật mới lộ ra. Xem `src/components/admin/search-form.tsx`.

    Vài điểm khác của thiết kế này:
    - **Không dùng `useRouter`/debounce** — form GET thuần, không cần state, không cần `"use client"` cho chính `AdminSearchForm`.
    - **`page` tự về 1 khi tìm mới**: form GET thay thế nguyên query string cũ nên `?page=3` tự rụng, không phải xử lý gì thêm.
    - **`Pager` nhận thêm prop `search`** để giữ `q` khi chuyển trang (thiếu là bấm "Sau" mất kết quả tìm). Href giờ dựng bằng `URLSearchParams`.
    - **`q` bị `.trim().slice(0, 100)`** ở page trước khi xuống DB. Prisma tham số hoá nên không có injection, cắt chỉ để chặn chuỗi rác dài từ URL.
    - **Không bỏ dấu tiếng Việt**: `mode: "insensitive"` chỉ lo hoa/thường, gõ "hang" không ra "Hằng" — y hệt search client-side cũ, không phải hồi quy. Muốn khớp không dấu phải thêm `unaccent`/`pg_trgm` ở Postgres.
    - **Sort vẫn là trong-trang**, cố ý không làm: chỉ xếp 20 dòng đang hiện. Muốn sort toàn bảng thì đẩy `orderBy` xuống 2 hàm `*Paged`.
    - `filterBySearch` trong `lib/admin/table-utils.ts` **vẫn còn dùng** cho `dishes-table`/`promotions-table` (2 bảng này nạp full list, không phân trang) — đừng xoá.

72. **✅ Đã kiểm khu admin bằng browser thật (2026-07-30) — khép lại phần trước đây chỉ có typecheck/build bảo đảm.** Đăng nhập `admin@beefhaven.vn` trên `localhost:3000`, chạy thật:
    - **Search đơn hàng**: tìm `BS-2025` → ra đơn năm 2025 vốn không nằm trong 20 dòng trang 1, "Trang 1 / 19" (lọc từ 32 trang tổng). Bấm "Sau" → `?q=BS-2025&page=2`, ô tìm kiếm giữ nguyên giá trị.
    - **Search đặt bàn**: gõ thường không dấu-hoa `nguyễn anh quân` → 6 kết quả, cũ nhất **17/01/2025** (tháng đầu tiên của dữ liệu) ⇒ đúng là tìm xuyên toàn bảng, không phải lọc trang.
    - **Ô bản dịch trong form món**: mở "Sửa Món Ăn" của `dish-ribeye-uc` → `toFormValues()` map đúng cả `nameEn`/`descriptionEn` từ DB, không có cảnh báo uncontrolled input. Sửa `nameEn` → Lưu → `updateDish` 200 → `/en/thuc-don` hiện ngay tên mới. **Đã sửa lại về giá trị gốc `"Australian Ribeye Steak"`** — dữ liệu demo không đổi.
    - **Form khuyến mãi**: đủ 5 ô En (`title/description/badgeLabel/badgeOffer/scheduleText`), đều nạp đúng giá trị từ DB. Chỉ mở xem, không lưu.

    ⚠️ **Bẫy khi tự động hoá Chrome trên máy này: page zoom 125%.** Toạ độ trong ảnh chụp ≈ toạ độ CSS × 1.27, nên click theo pixel trượt mục tiêu và trông y như "nút hỏng" (đã mất thời gian nghi oan cho nút "Tìm" và "Sau"). Dùng click qua DOM (`element.click()`) hoặc `ref` thay vì toạ độ. Liên quan #6/#21/#23 về các trục trặc khác của môi trường sandbox này.

    ⚠️ **Nút xoá trong bảng admin xoá NGAY, không confirm** (#42) — khi thao tác bằng script/automation phải nhắm `button[aria-label="Sửa món"]` tường minh, đừng lấy nút theo thứ tự.

73. **`/img/` và `/docs/superpowers/` đã cho vào `.gitignore` (2026-07-30), cố ý KHÔNG commit.**
    - `img/` là 29 ảnh gốc chủ dự án gửi, **cả 29 file trùng byte-for-byte với bản đã có trong `public/images/`** — kể cả 5 file `promo-*v2.jpg` (chỉ khác tên, nội dung y hệt bản đang chạy, đã kiểm bằng `cmp`). Không có ảnh nào là mới hay chưa dùng. Commit vào là +61MB trùng lặp **vĩnh viễn** trong lịch sử git, gỡ ra phải rewrite history + force-push như #44. App chỉ đọc `public/images/`, nên thư mục này thuần túy là bản lưu trên máy.
    - `docs/superpowers/` là file kế hoạch do công cụ AI sinh — cùng lý do với `/.claude/` ở khối trên và với việc đã xóa `CLAUDE.md`/`AGENTS.md`: repo trên GitHub không mang dấu vết công cụ AI (#44).

74. **⚠️⚠️ ĐÃ XOÁ REPO CŨ VÀ TẠO LẠI TỪ ĐẦU (2026-07-30) — đọc kỹ, đây là mốc quan trọng nhất về mặt lịch sử git.**

    **Lý do:** như #44 phân tích, `refs/pull/*` của PR #11–#21 còn dòng ghi công AI và GitHub không cho xoá, nên sidebar Contributors vẫn hiện 2 người. Không có cách nào khác ngoài xoá repo.

    **Đã làm:** chủ dự án tự xoá repo cũ (thao tác huỷ vĩnh viễn) → tạo lại cùng tên, Public → push `main` (39 commit, đã verify 0 trailer bằng cả `grep` lẫn `git log --format='%(trailers)'`) → đổi default branch về `main` → xoá nhánh trung gian. **Kết quả: sidebar Contributors = 1, chỉ `hungknh`.**

    **Mất vĩnh viễn (không lấy lại được, đừng đi tìm):** 34 PR cũ kèm mô tả, lịch sử GitHub Actions, lịch sử deployment gắn với repo cũ. Vì vậy bảng giai đoạn ở đầu file giờ trỏ **commit squash** thay vì link PR.

    **Bản sao lưu trước khi xoá:** `C:\Project\_backup\BeefSteakRestaurant-main-backup.bundle` (51MB, đã `git bundle verify` → "records a complete history"). Khôi phục nếu cần: `git clone <đường-dẫn-bundle> <thư-mục-mới>`.

    **Việc phải làm sau khi tạo lại repo** (đã làm, ghi lại để lần sau khỏi quên): đổi default branch về `main` — GitHub tự đặt nhánh **đầu tiên được push** làm default, và **không cho xoá nhánh đang là default** (gặp đúng lỗi `refusing to delete the current branch`); nối lại Vercel ↔ GitHub; sửa link PR chết trong `PROGRESS.md`.

    Cũng vì lịch sử `main` bị rewrite ở #44 rồi push sang repo mới, **mọi clone cũ trên máy khác đều không còn dùng được** — clone lại từ đầu, đừng `git pull`.

## Cách tiếp tục ở phiên mới

1. Đọc file này + `PLAN.md`.
2. `git status` / `git log --oneline -10` để xác nhận đúng những gì bảng trên ghi.
3. **Nếu bảng "Trạng thái hiện tại" đang ghi có PR "chưa merge"** (checkpoint hoặc giai đoạn đang dở) → `git checkout <tên-nhánh>` để làm tiếp trên đúng nhánh đó, ĐỪNG tạo nhánh mới từ `main`.
4. Chạy `npm run dev`, mở `http://localhost:3000` kiểm tra nhanh trạng thái hiện tại. `.env` cục bộ đã trỏ `DATABASE_URL`/`DIRECT_URL` sang Neon Postgres thật — không cần setup DB riêng, nhưng cũng nghĩa là **dev đụng thẳng vào dữ liệu chung**, cẩn thận khi test các thao tác ghi/xóa.
5. Nếu bắt đầu giai đoạn/việc mới hoàn toàn: tạo nhánh mới, làm theo PLAN.md mục 7, cập nhật lại bảng trạng thái + mục "Sai khác" trong file này trước khi mở PR.
6. **Muốn seed lại dữ liệu lịch sử từ đầu** (ví dụ đổi logic sinh dữ liệu trong `prisma/seed.ts`): `npx prisma migrate reset --force` — lệnh này bị Prisma CLI chặn khi phát hiện chạy từ AI agent, phải hỏi ý kiến chủ dự án trước (xem "Sai khác" #35), rồi `npx prisma db seed` (không tự chạy kèm `migrate reset` ở Prisma 7, xem #34). Script chạy khá lâu (~600 lượt ghi tuần tự, vài phút) vì gọi Neon qua network cho từng bản ghi, không batch.
