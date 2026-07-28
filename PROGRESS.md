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

**Đã xong đến hết Giai đoạn 9 (Nối data thật), tất cả đã merge vào `main`.** Web live **đọc/ghi database thật** (Neon Postgres), không còn mock tĩnh. **Link demo: https://beefsteakhouse.vercel.app** — đăng nhập thử: `admin@beefhaven.vn` / `admin1234` (admin) hoặc bất kỳ email nào trong DB / `password123` (khách).

**Database đã chuyển từ SQLite sang Neon Postgres** (sớm hơn dự tính PLAN.md Giai đoạn 13) — lý do: cần DB thật để bản deploy trên Vercel phản ánh dữ liệu thật, không chỉ đọc mock. Xem "Sai khác" #37–#39 trước khi động vào `schema.prisma`/`prisma/seed.ts`/`src/lib/prisma.ts`.

**Dữ liệu hiện tại là dữ liệu lịch sử giả nhưng chân thực** — sinh từ 01/2025 đến hiện tại (574 ngày), theo hệ số thực tế (tăng trưởng dần, cuối tuần đông hơn, Tết/Valentine/Giáng Sinh), dùng đúng `bestPromotion()` thật của app để tính giảm giá: **632 đơn hàng, 460 đặt bàn, 113 đánh giá, 71 khách hàng**. Xem "Sai khác" #40–#41. Muốn seed lại từ đầu: xem mục "Cách tiếp tục ở phiên mới".

PR đã merge trong phiên này (theo đúng thứ tự phụ thuộc): #13 (Giai đoạn 7 — Database, SQLite ban đầu) → #17 (Giai đoạn 8 — Auth, thay cho #16 bị đóng tự động vì nhánh gốc bị xoá, xem #35) → #14 (admin UI polish) → #15 (font số/giá tiền) → #18 (Giai đoạn 9 — nối data thật + Neon + dữ liệu lịch sử + dashboard thống kê). PR #19 (`.vercelignore`, nhỏ, không ảnh hưởng chức năng) đang chờ merge.

| Giai đoạn | Trạng thái | PR |
|---|---|---|
| 0 — Khởi tạo project | ✅ Xong | (commit trực tiếp trước khi thống nhất quy trình PR) |
| 1 — Design system + Layout shell | ✅ Xong | [#1](https://github.com/hungknh/BeefSteakRestaurant/pull/1) |
| 2 — Trang chủ | ✅ Xong | [#3](https://github.com/hungknh/BeefSteakRestaurant/pull/3) |
| 3 — Khuyến mãi + Thực đơn | ✅ Xong | [#6](https://github.com/hungknh/BeefSteakRestaurant/pull/6) |
| 4 — Discount engine | ✅ Xong | [#8](https://github.com/hungknh/BeefSteakRestaurant/pull/8) |
| 5 — Giỏ hàng + Đặt bàn (UI) | ✅ Xong | [#9](https://github.com/hungknh/BeefSteakRestaurant/pull/9) |
| 6 — Admin UI (mock) | ✅ Xong | [#10](https://github.com/hungknh/BeefSteakRestaurant/pull/10) |
| Checkpoint — Chốt frontend | ✅ Xong | [#11](https://github.com/hungknh/BeefSteakRestaurant/pull/11) |
| 7 — Database (Prisma + Postgres) | ✅ Xong | [#13](https://github.com/hungknh/BeefSteakRestaurant/pull/13) |
| 8 — Auth | ✅ Xong | [#17](https://github.com/hungknh/BeefSteakRestaurant/pull/17) |
| 9 — Nối data thật + dữ liệu lịch sử + dashboard thống kê | ✅ Xong | [#18](https://github.com/hungknh/BeefSteakRestaurant/pull/18) |
| 10 — Review | ⬜ Chưa làm | |
| 11 — Admin backend | ⬜ Chưa làm | |
| 12 — Hoàn thiện (SEO/test/CI) | ⬜ Chưa làm | |
| 13 — Deploy production | 🔶 Một phần (đã lên Neon + Vercel, còn lại: custom domain/tài khoản demo chính thức đã có) | |
| 14 — Đóng gói cho CV | ⬜ Chưa làm | |
| 15 — Optional | ⬜ Không làm trừ khi được yêu cầu | |

## Việc cần làm tiếp

Chưa bắt đầu Giai đoạn 10 (Review — Server Action `createReview`, `@@unique([userId, dishId])`, cập nhật `avgRating` cùng transaction, `useOptimistic`). Tạo nhánh mới từ `main` khi bắt đầu.

⚠️ Nhắc lại từ PLAN.md: **middleware/proxy chỉ chặn ở tầng route** — hiện admin CRUD (Giai đoạn 6) vẫn chỉ là `useState` cục bộ, chưa có Server Action nào cần check role. Tới **Giai đoạn 11 (Admin backend)** khi thêm Server Actions thật, mỗi action phải tự check `session.user.role === "ADMIN"` lại, không tin middleware là đủ.

⚠️ Admin `orders`/`reservations` table hiện load **toàn bộ** bản ghi (632 đơn, 460 đặt bàn) vào 1 trang, không phân trang — vẫn dùng được nhưng là bảng khá dài để cuộn. Phân trang server-side là việc của Giai đoạn 11 theo đúng kế hoạch gốc, chưa làm bây giờ.

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

## Cách tiếp tục ở phiên mới

1. Đọc file này + `PLAN.md`.
2. `git status` / `git log --oneline -10` để xác nhận đúng những gì bảng trên ghi.
3. **Nếu bảng "Trạng thái hiện tại" đang ghi có PR "chưa merge"** (checkpoint hoặc giai đoạn đang dở) → `git checkout <tên-nhánh>` để làm tiếp trên đúng nhánh đó, ĐỪNG tạo nhánh mới từ `main`.
4. Chạy `npm run dev`, mở `http://localhost:3000` kiểm tra nhanh trạng thái hiện tại. `.env` cục bộ đã trỏ `DATABASE_URL`/`DIRECT_URL` sang Neon Postgres thật — không cần setup DB riêng, nhưng cũng nghĩa là **dev đụng thẳng vào dữ liệu chung**, cẩn thận khi test các thao tác ghi/xóa.
5. Nếu bắt đầu giai đoạn/việc mới hoàn toàn: tạo nhánh mới, làm theo PLAN.md mục 7, cập nhật lại bảng trạng thái + mục "Sai khác" trong file này trước khi mở PR.
6. **Muốn seed lại dữ liệu lịch sử từ đầu** (ví dụ đổi logic sinh dữ liệu trong `prisma/seed.ts`): `npx prisma migrate reset --force` — lệnh này bị Prisma CLI chặn khi phát hiện chạy từ AI agent, phải hỏi ý kiến chủ dự án trước (xem "Sai khác" #35), rồi `npx prisma db seed` (không tự chạy kèm `migrate reset` ở Prisma 7, xem #34). Script chạy khá lâu (~600 lượt ghi tuần tự, vài phút) vì gọi Neon qua network cho từng bản ghi, không batch.
