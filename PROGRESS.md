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

**Đã xong đến hết Giai đoạn 6.** **Checkpoint "Chốt frontend" đã xong toàn bộ checklist** trên nhánh `fix/checkpoint-responsive-a11y` (PR [#11](https://github.com/hungknh/BeefSteakRestaurant/pull/11), **chưa merge**). Đã thay ảnh thật, đổi thương hiệu sang **"Beef Haven"** + thêm logo, chụp screenshot README, đổi tên ảnh khuyến mãi theo tên gốc, đổi font toàn site, và **deploy Vercel lần đầu (2026-07-28, xác nhận bởi chủ dự án)** — tất cả **đã commit lên nhánh này** (xem mục "Sai khác" #24/#25/#26 để biết chi tiết). **Link demo: https://beefsteakhouse.vercel.app** (project `hung-dfd0/beefsteakhouse` trên Vercel). Việc còn lại duy nhất là **merge PR #11 vào `main`** rồi mới sang Giai đoạn 7 — chưa merge vì đó là hành động ảnh hưởng nhánh `main` chung, cần chủ dự án xác nhận riêng. Phiên mới muốn tiếp tục thì `git checkout fix/checkpoint-responsive-a11y`, đừng bắt đầu từ `main`; chạy `git status` trước để biết có đang có thay đổi working-tree nào còn treo chưa commit không.

**⚠️ Phiên 2026-07-22 có thêm 2 việc phát sinh ngoài checklist gốc, đã commit ở phiên 2026-07-28** (xem mục "Sai khác" #24/#25 để biết chi tiết):
- Đổi tên 5 ảnh khuyến mãi từ `promo-*.jpg` sang tên gốc chủ dự án đặt (`gio-vang.jpg`, `steak-night.jpg`, `lang-man.jpg`, `dat-nhieu.jpg`, `combo-cuoi-tuan.jpg`), sửa `imageUrl` tương ứng trong `_mock.ts`. 5 file `promo-*.jpg` cũ trong `public/images/` giờ không còn dùng, chưa xóa.
- Đổi font toàn site trong `src/app/layout.tsx`: heading `Playfair Display` → `Cormorant Garamond`, body `Inter` → `Lora`.
- `public/images/logo.jpg` và `screenshots/trang-chu.jpg` cũng có trong đợt commit này — chủ dự án xác nhận (2026-07-28) đây là thay đổi logo có chủ đích từ trước, chỉ là chưa ghi vào file này, không phải lỗi ghi đè ngoài ý muốn như nghi ngờ ban đầu.

| Giai đoạn | Trạng thái | PR |
|---|---|---|
| 0 — Khởi tạo project | ✅ Xong | (commit trực tiếp trước khi thống nhất quy trình PR) |
| 1 — Design system + Layout shell | ✅ Xong | [#1](https://github.com/hungknh/BeefSteakRestaurant/pull/1) |
| 2 — Trang chủ | ✅ Xong | [#3](https://github.com/hungknh/BeefSteakRestaurant/pull/3) |
| 3 — Khuyến mãi + Thực đơn | ✅ Xong | [#6](https://github.com/hungknh/BeefSteakRestaurant/pull/6) |
| 4 — Discount engine | ✅ Xong | [#8](https://github.com/hungknh/BeefSteakRestaurant/pull/8) |
| 5 — Giỏ hàng + Đặt bàn (UI) | ✅ Xong | [#9](https://github.com/hungknh/BeefSteakRestaurant/pull/9) |
| 6 — Admin UI (mock) | ✅ Xong | [#10](https://github.com/hungknh/BeefSteakRestaurant/pull/10) |
| Checkpoint — Chốt frontend | 🔶 Đang làm | [#11](https://github.com/hungknh/BeefSteakRestaurant/pull/11) (chưa merge) |
| 7 — Database (Prisma + SQLite) | ⬜ Chưa làm | |
| 8 — Auth | ⬜ Chưa làm | |
| 9 — Nối data thật | ⬜ Chưa làm | |
| 10 — Review | ⬜ Chưa làm | |
| 11 — Admin backend | ⬜ Chưa làm | |
| 12 — Hoàn thiện (SEO/test/CI) | ⬜ Chưa làm | |
| 13 — Deploy production | ⬜ Chưa làm | |
| 14 — Đóng gói cho CV | ⬜ Chưa làm | |
| 15 — Optional | ⬜ Không làm trừ khi được yêu cầu | |

## Việc cần làm tiếp (Checkpoint "Chốt frontend" — PLAN.md, trước Giai đoạn 7)

Nhánh đang làm: `fix/checkpoint-responsive-a11y` (PR #11, chưa merge — commit tiếp lên nhánh này, đừng tạo nhánh mới cho phần còn lại của checkpoint).

- [x] Responsive không vỡ — **không verify pixel-perfect 375/768/1440 được** vì sandbox không resize viewport Chrome chính xác (xem mục "Sai khác" #6, đã thử lại và xác nhận lần nữa ở #21). Đã bù bằng audit code toàn bộ layout/grid cố định, tìm và fix 1 bug thật: 5 bảng admin tràn ngang do thiếu `overflow-x-auto` (xem #21). Nếu có máy thật/DevTools thì nên tự kiểm lại pixel-perfect trước khi tick hẳn mục này.
- [x] Tab qua hết mọi nút, focus ring rõ trên nền tối — fix xong, xem #22.
- [x] Contrast chữ muted kiểm bằng DevTools (≥ 4.5:1) — verify bằng công thức WCAG trực tiếp trên giá trị hex token (không cần trình duyệt), tất cả cặp màu đều ≥ 7:1 (AAA), không cần sửa.
- [x] Mọi ảnh có `alt`, console không warning — verify xong, không cần sửa (9/9 chỗ dùng `<Image>` đều có alt có nghĩa).
- [x] **Thay ảnh `picsum.photos` bằng ảnh món ăn thật** — chủ dự án đưa 23 ảnh vào folder `img/` ở root project (đúng tên file gợi ý). Đã copy cả 23 file vào `public/images/`, sửa `imageUrl` trong `_mock.ts` (15 dish + 5 promo, dùng `sed` map theo id) và 3 chỗ hardcode URL picsum trong `hero.tsx`/`reservation-cta.tsx`/`menu-preview.tsx` sang path local `/images/...`. Verify: không còn chuỗi `picsum` nào trong `src/`, `curl` các route `/`, `/thuc-don` và vài file ảnh đều trả `200`. Folder `img/` gốc ở root vẫn còn (chưa xóa, không track git — có thể dọn sau).
- [x] **Commit các thay đổi thay ảnh — đã được chủ dự án xác nhận, commit xong lên `fix/checkpoint-responsive-a11y`.** `public/images/` (23 ảnh món/khuyến mãi + `logo.jpg`), `_mock.ts`, `hero.tsx`, `menu-preview.tsx`, `reservation-cta.tsx`. `img/` gốc ở root vẫn giữ nguyên, không track git (tham khảo/dọn sau).
- [x] **Đổi thương hiệu "BeefSteakHouse" → "Beef Haven" + thêm logo** (chủ dự án cung cấp `img/logo.jpg`, đầu bò vàng nền đen). Đổi tên hiển thị ở `header.tsx`, `footer.tsx` (kèm email `lienhe@beefhaven.vn`, copyright), `admin-sidebar.tsx`, metadata title (`layout.tsx`), mô tả trang `/khuyen-mai` + `/thuc-don`, alt text ảnh hero/menu-preview/reservation-cta, comment `globals.css`. Xem "Sai khác" #23 về bug `next/image` gặp phải khi thêm logo. **Cố tình không đổi** (không phải nội dung hiển thị): tên package `beefsteakhouse` trong `package.json`, key localStorage `beefsteak-cart` (`store/cart.ts`), mã đơn hàng mock `BS-...` (`_mock.ts`).
- [x] Screenshot cho README — đã chụp 4 trang (Trang chủ, Khuyến Mãi, Thực Đơn, Admin) sau khi có ảnh thật + logo mới, lưu ở `screenshots/`, gắn vào `README.md`.
- [x] **Deploy Vercel lần đầu để có link demo sớm** — chủ dự án xác nhận (2026-07-28), đã deploy bằng `npx vercel --prod --yes`. Project `hung-dfd0/beefsteakhouse`, production URL **https://beefsteakhouse.vercel.app**. Xem #26 về giới hạn (chưa auto-deploy theo git push).

Còn lại duy nhất trước khi sang Giai đoạn 7: `gh pr merge 11 --squash --delete-branch` (cần chủ dự án xác nhận riêng vì ảnh hưởng `main` chung) → mới sang **Giai đoạn 7 — Database**: `npx prisma init`, dịch `src/types/index.ts` sang `schema.prisma`, `prisma/seed.ts` bê `_mock.ts` vào. Xem PLAN.md mục 7 "GIAI ĐOẠN 7".

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

## Cách tiếp tục ở phiên mới

1. Đọc file này + `PLAN.md`.
2. `git status` / `git log --oneline -10` để xác nhận đúng những gì bảng trên ghi.
3. **Nếu bảng "Trạng thái hiện tại" đang ghi có PR "chưa merge"** (checkpoint hoặc giai đoạn đang dở) → `git checkout <tên-nhánh>` để làm tiếp trên đúng nhánh đó, ĐỪNG tạo nhánh mới từ `main`.
4. Chạy `npm run dev`, mở `http://localhost:3000` kiểm tra nhanh trạng thái hiện tại.
5. Nếu bắt đầu giai đoạn/việc mới hoàn toàn: tạo nhánh mới, làm theo PLAN.md mục 7, cập nhật lại bảng trạng thái + mục "Sai khác" trong file này trước khi mở PR.
