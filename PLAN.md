# BeefSteakHouse — Kế hoạch xây dựng

> Project portfolio cho vị trí **JS Developer Intern**.
> Chiến lược: **Frontend-first**. Dựng xong toàn bộ giao diện chạy trên mock data, chốt UI, rồi mới gắn database vào sau.
> Design: bám sát mẫu Figma (dark + gold, serif cao cấp), mở rộng bố cục cho các tính năng thêm.

---

## 0. Tech stack (chốt)

| Lớp | Công nghệ | Lý do chọn |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Một repo cho cả FE + BE. TS là bắt buộc với JD intern hiện nay. |
| Styling | **Tailwind CSS v4 + shadcn/ui** | shadcn copy component vào repo → code là của bạn, không phải dependency đen. |
| Form | **react-hook-form + Zod** | Zod schema dùng chung cho cả client validate và server validate. Viết 1 lần. |
| Cart state | **Zustand + persist** | Giỏ hàng sống qua reload. Context API cũng được nhưng persist phải tự viết. |
| Database | **SQLite (dev) → PostgreSQL/Neon (prod)** | Dev: 1 file, không cài gì. Prod: đổi 1 dòng provider. |
| ORM | **Prisma** | JD intern VN hỏi Prisma nhiều nhất. Prisma Studio xem data trực quan. |
| Auth | **Auth.js (NextAuth v5)** — Credentials + Google | Tự viết credentials flow → có cái để kể trong phỏng vấn. |
| Mutations | **Server Actions** (chính) + **Route Handlers** (một ít) | Server Actions cho form. Route Handlers cho `/api/menu` để có REST API thật đưa vào CV. |
| Ảnh | `next/image` + `/public` (dev) → **UploadThing** (khi làm admin upload) | |
| Test | **Vitest** (unit) + **Playwright** (2-3 luồng E2E) | Không cần coverage 100%. Cần *có* test. |
| Deploy | **Vercel + Neon** | Free, không Docker. |

**Không dùng:** Docker, Redis, microservice, GraphQL, React Query — Server Components đã cover. Thêm vào chỉ để "cho oách" là điểm trừ khi phỏng vấn hỏi "tại sao dùng cái này?".

**Ngôn ngữ / tiền tệ:** Tiếng Việt, VNĐ. Không i18n.

---

## 1. Phạm vi tính năng

| Mảng | Trạng thái |
|---|---|
| Menu + chi tiết món | ✅ Làm |
| Đặt bàn (reservation) | ✅ Làm |
| **Khuyến mãi + engine giảm giá thật** | ✅ Làm — điểm nhấn kỹ thuật |
| Đặt món online (cart → checkout → order) | ✅ Làm |
| Review + rating trên món | ✅ Làm |
| Admin dashboard | ✅ Làm |
| Blog/Community CMS riêng | ❌ Cắt → Giai đoạn 14 (optional) |

> **Lý do cắt blog:** CRUD lặp lại y hệt admin dashboard → không thêm điểm gì cho CV nhưng tốn 1 tuần. Review có rating thì có logic thật (điểm trung bình, chặn trùng, transaction) → đáng kể hơn.

---

## 2. ⭐ Design system (rút từ screenshot Figma)

### 2.1 Màu

Đây là giá trị tôi đọc từ ảnh — sẽ tinh chỉnh khi dựng thật.

```css
/* src/app/globals.css */
:root {
  /* Nền — đen ngả nâu ấm, KHÔNG phải đen thuần #000 */
  --background:        #0F0D0C;   /* nền trang */
  --background-alt:    #151211;   /* section xen kẽ */
  --card:              #17130F;   /* nền card */
  --border:            #2A2320;   /* viền card, rất mờ */

  /* Vàng đồng — màu thương hiệu */
  --primary:           #D4AF37;   /* nút CTA, chữ nhấn, icon */
  --primary-foreground:#0F0D0C;   /* chữ trên nền vàng — đen, không phải trắng */
  --primary-muted:     #C9A227;   /* eyebrow, meta text */

  /* Chữ */
  --foreground:        #F5EFE2;   /* heading — kem, KHÔNG phải trắng #FFF */
  --muted-foreground:  #A29B93;   /* body text */

  /* Badge */
  --badge-label:       #7B1F1F;   /* maroon: MOST POPULAR / DAILY / ROMANTIC */
  --badge-offer:       #D9B740;   /* gold: 30% OFF / FREE SIDES */
}
```

**3 chi tiết làm nên chất "cao cấp" của design này — đừng làm hỏng:**
1. Nền là **đen ngả nâu ấm** (`#0F0D0C`), không phải `#000`. Đen thuần trông rẻ tiền.
2. Chữ heading là **kem** (`#F5EFE2`), không phải trắng. Trắng thuần trên nền tối gây chói.
3. Chữ trên nút vàng là **đen**, không phải trắng. Vàng + trắng không đủ contrast → fail a11y.

### 2.2 Font

```ts
// src/app/layout.tsx
import { Playfair_Display, Inter } from "next/font/google";

const serif = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: "--font-serif" });
const sans  = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
```

- **Playfair Display** (serif) — logo, heading, giá tiền. Có subset `vietnamese` ✅
- **Inter** (sans) — body, nav, button, form. Có subset `vietnamese` ✅

⚠️ **Bắt buộc khai báo `subsets: [..., "vietnamese"]`.** Không có là chữ có dấu (ế, ộ, ưỡ) rơi về font fallback → heading vỡ font ngay giữa câu. Đây là bug kinh điển khi bê design tiếng Anh sang tiếng Việt.

Kiểm tra ngay ngày đầu bằng chuỗi: `Đặt bàn — Trải nghiệm khó quên · Sườn nướng`

### 2.3 Pattern lặp lại (rút từ ảnh → thành component)

Design này lặp đúng 4 pattern. Viết component 1 lần, dùng khắp nơi:

**A. `<SectionHeading>`** — xuất hiện ở mọi section
```
    LIMITED TIME OFFERS        ← eyebrow: gold, uppercase, tracking-[0.2em], text-sm
    Exclusive Promotions       ← title: serif, cream, text-5xl/6xl
      ─────  ✦  ─────          ← ornament: 2 đường kẻ gold + sparkle ở giữa
    (mô tả phụ, tùy chọn)      ← muted, max-w-2xl, center
```
Props: `eyebrow`, `title`, `description?`

**B. `<TopBar>`** — dải trên cùng: `EST. 2010 · PREMIUM STEAKHOUSE`, gold, uppercase, tracking rất rộng, `text-xs`

**C. Badge đôi trên card** — `absolute top-4 left-4` (maroon label) + `absolute top-4 right-4` (gold offer)

**D. Nút viền** — nền trong suốt, `border border-primary`, chữ gold, uppercase, tracking wide. Khác với nút CTA nền vàng đặc.

### 2.4 Nav — điều chỉnh cho nhiều tính năng hơn

Design gốc có 5 mục nav. Bạn thêm giỏ hàng, tài khoản, admin → nav sẽ phình. **Giải pháp: giữ đúng 5 mục ở giữa, đẩy phần mới sang phải.**

```
[Logo]        TRANG CHỦ  KHUYẾN MÃI  THỰC ĐƠN  ĐẶT BÀN  LIÊN HỆ        [🛒 2] [👤▾] [ĐẶT BÀN]
```

- **Admin không lên nav** — vào qua dropdown avatar. Khách không cần thấy.
- **Review không lên nav** — nằm trong trang chi tiết món.
- `< 1280px` → nav giữa gộp vào hamburger, giữ lại icon giỏ + avatar.
- Mục đang active: gạch chân gold (đúng như ảnh mẫu).

Nhờ vậy header vẫn thoáng như design gốc dù chức năng nhiều gấp đôi.

---

## 3. Cấu trúc thư mục

```
src/
  app/
    (public)/
      page.tsx                    # Trang chủ
      khuyen-mai/page.tsx         # Danh sách khuyến mãi
      khuyen-mai/[slug]/page.tsx  # Chi tiết khuyến mãi
      thuc-don/page.tsx           # Danh sách món
      thuc-don/[slug]/page.tsx    # Chi tiết món + review
      dat-ban/page.tsx
      gio-hang/page.tsx
      thanh-toan/page.tsx
      lien-he/page.tsx
    (auth)/
      dang-nhap/page.tsx
      dang-ky/page.tsx
    tai-khoan/
      page.tsx
      don-hang/page.tsx
      dat-ban/page.tsx
    admin/
      layout.tsx                  # Guard role=ADMIN
      page.tsx                    # Thống kê
      dishes/ | promotions/ | reservations/ | orders/
    api/
      menu/route.ts               # REST API công khai
      auth/[...nextauth]/route.ts
  components/
    ui/                           # shadcn
    layout/                       # TopBar, Header, MobileNav, Footer
    shared/                       # SectionHeading, OrnamentDivider, Price, RatingStars
    home/                         # Hero, FeaturedPromotions, StandardCards, MenuPreview
    menu/                         # DishCard, DishGrid, CategoryFilter
    promotion/                    # PromoCard, PromoBadges
    cart/                         # CartItem, CartSummary, CartDrawer
    reservation/                  # ReservationForm, TimeSlotPicker
    review/                       # ReviewList, ReviewForm
  lib/
    data/                         # ⭐ LỚP QUAN TRỌNG NHẤT — xem mục 4
      dishes.ts | promotions.ts | reservations.ts | orders.ts | reviews.ts
    promotions/
      apply.ts                    # ⭐ Discount engine — hàm thuần, xem mục 6
    validations/                  # Zod schemas
    format.ts                     # formatVND()
  types/index.ts
  store/cart.ts
prisma/
  schema.prisma
  seed.ts
```

---

## 4. ⭐ Chìa khóa của chiến lược "frontend trước"

Đây là phần quyết định plan này thành hay bại. Đọc kỹ.

**Vấn đề:** Làm frontend với mock data xong, lúc gắn DB vào phải sửa lại hết page → công cốc.

**Cách tránh:** Định nghĩa **data contract** ngay từ ngày đầu. Mọi page **chỉ** gọi hàm trong `lib/data/`, không bao giờ import mock trực tiếp.

**Giai đoạn 2 (mock):**
```ts
// src/lib/data/dishes.ts
import { MOCK_DISHES } from "./_mock";
import type { Dish } from "@/types";

export async function getDishes(filter?: { category?: string }): Promise<Dish[]> {
  const all = MOCK_DISHES;
  return filter?.category ? all.filter(d => d.category.slug === filter.category) : all;
}
```

**Giai đoạn 8 — cùng file, thay ruột:**
```ts
// src/lib/data/dishes.ts
import { prisma } from "@/lib/prisma";
import type { Dish } from "@/types";

export async function getDishes(filter?: { category?: string }): Promise<Dish[]> {
  return prisma.dish.findMany({
    where: filter?.category ? { category: { slug: filter.category } } : undefined,
    include: { category: true },
  });
}
```

**Page không đổi 1 dòng nào.** Chữ ký hàm giống hệt, type giống hệt, `async` từ đầu nên không cần đổi sang `await`.

**3 luật bắt buộc:**
1. Mọi hàm trong `lib/data/` phải `async` ngay từ mock — dù mock trả về đồng bộ.
2. Type trong `src/types/index.ts` phải **khớp chính xác** với Prisma schema sẽ viết ở Giai đoạn 6. Viết type trước, viết schema sau theo type.
3. Page/component **cấm** import `_mock` trực tiếp. Chỉ đi qua `lib/data/`.

---

## 5. Data model

```ts
// src/types/index.ts — viết ở Giai đoạn 1
export type Role = "USER" | "ADMIN";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "DELIVERING" | "COMPLETED" | "CANCELLED";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "SEATED" | "CANCELLED" | "NO_SHOW";
export type Doneness = "RARE" | "MEDIUM_RARE" | "MEDIUM" | "MEDIUM_WELL" | "WELL_DONE";
export type DiscountType = "PERCENT" | "FIXED" | "NONE";
export type PromoScope = "ALL" | "CATEGORY" | "DISH";

export type Category = { id: string; name: string; slug: string; sortOrder: number };

export type Dish = {
  id: string; name: string; slug: string; description: string;
  price: number;                  // Int, đơn vị VNĐ
  imageUrl: string; categoryId: string; category?: Category;
  isAvailable: boolean; isFeatured: boolean;
  weightGram: number | null; hasDoneness: boolean;
  avgRating: number; reviewCount: number;
};

export type Promotion = {
  id: string; title: string; slug: string; description: string; imageUrl: string;
  // Hiển thị — đúng như 2 badge trong design
  badgeLabel: string;             // "PHỔ BIẾN NHẤT" | "HÀNG NGÀY" | "LÃNG MẠN" | "CUỐI TUẦN"
  badgeOffer: string;             // "GIẢM 30%" | "TẶNG MÓN PHỤ"
  scheduleText: string;           // "THỨ 5 HÀNG TUẦN" | "T2-T6, 17:00-19:00"
  // Logic tính tiền — xem mục 6
  discountType: DiscountType;
  discountValue: number;          // PERCENT: 0-100 | FIXED: số VNĐ
  scope: PromoScope;
  targetCategoryId: string | null;
  targetDishId: string | null;
  daysOfWeek: string;             // "1,4,6" (0=CN). Rỗng = mọi ngày
  startTime: string | null;       // "17:00"
  endTime: string | null;         // "19:00"
  minSubtotal: number;            // 0 = không yêu cầu
  startDate: string | null; endDate: string | null;
  isActive: boolean; sortOrder: number;
};

export type User = { id: string; name: string; email: string; image: string | null; role: Role };

export type Reservation = {
  id: string; userId: string | null; promotionId: string | null;
  guestName: string; guestPhone: string; guestEmail: string;
  date: string; timeSlot: string; partySize: number;
  note: string | null; status: ReservationStatus; createdAt: string;
};

export type OrderItem = {
  id: string; orderId: string; dishId: string; dish?: Dish;
  quantity: number; unitPrice: number; doneness: Doneness | null; note: string | null;
};

export type Order = {
  id: string; code: string; userId: string | null; status: OrderStatus;
  items: OrderItem[];
  subtotal: number; discount: number; shippingFee: number; total: number;
  appliedPromotionId: string | null; appliedPromotionTitle: string | null;  // ⚠️ xem ghi chú
  receiverName: string; receiverPhone: string; address: string;
  createdAt: string;
};

export type Review = {
  id: string; dishId: string; userId: string; user?: User;
  rating: number; content: string; createdAt: string;
};
```

**Quy tắc để đổi SQLite → Postgres không đau:**
- Mọi `Role`/`Status`/`Doneness`/`DiscountType` khai báo là `String` trong Prisma, **không dùng `enum`** (SQLite không hỗ trợ). Type safety đã có ở tầng TS + Zod.
- Không dùng scalar list (`String[]`) → đó là lý do `daysOfWeek` là chuỗi `"1,4,6"`.
  `// ponytail: CSV string vì SQLite không có array. Đổi sang Int[] nếu sau này chỉ chạy Postgres.`
- `price`, `subtotal`, `discount`, `total` → **`Int`, đơn vị đồng.** Tiền mà dùng `Float` là bug chờ nổ (`0.1 + 0.2 !== 0.3`).

**⚠️ `appliedPromotionTitle` — tại sao lưu cả tên chứ không chỉ FK:**
Đơn hàng là **bản ghi lịch sử**. Admin sửa/xóa khuyến mãi tháng sau thì đơn tháng trước phải hiển thị nguyên như lúc đặt. Tương tự `unitPrice` trong `OrderItem` — lưu giá **tại thời điểm đặt**, không join sang `Dish.price`. Đây là điểm nhà tuyển dụng đánh giá cao vì nó cho thấy bạn hiểu dữ liệu lịch sử khác dữ liệu hiện tại.

---

## 6. ⭐ Discount engine

Đây là phần kỹ thuật đáng giá nhất project. Làm cho đúng.

**Thiết kế: một hàm thuần (pure function), không đụng DB, không đụng React.**

```ts
// src/lib/promotions/apply.ts
import type { Promotion, Dish } from "@/types";

export type CartLine = { dish: Dish; quantity: number };
export type PromoResult = { promotion: Promotion; discount: number } | null;

/** Trả về khuyến mãi tốt nhất áp được cho giỏ hàng tại thời điểm `now`. */
export function bestPromotion(lines: CartLine[], promos: Promotion[], now: Date): PromoResult {
  const subtotal = lines.reduce((s, l) => s + l.dish.price * l.quantity, 0);

  const applicable = promos
    .filter(p => p.isActive)
    .filter(p => isWithinDateRange(p, now))
    .filter(p => isOnAllowedDay(p, now))
    .filter(p => isWithinTimeWindow(p, now))
    .filter(p => subtotal >= p.minSubtotal)
    .map(p => ({ promotion: p, discount: computeDiscount(p, lines) }))
    .filter(r => r.discount > 0);

  if (applicable.length === 0) return null;

  // ponytail: chỉ áp 1 khuyến mãi tốt nhất, không cộng dồn.
  // Cộng dồn cần rule ưu tiên + chặn giảm quá 100% → chưa cần. Đổi khi có yêu cầu thật.
  return applicable.reduce((best, cur) => (cur.discount > best.discount ? cur : best));
}
```

**Tại sao tách thành hàm thuần:**
1. **Test cực dễ** — không cần DB, không cần mock, không cần render. Đây là chỗ viết Vitest.
2. **Dùng được cả 2 phía** — client hiển thị giá tạm tính real-time ở giỏ hàng, server tính lại lúc tạo đơn. Cùng 1 hàm → không bao giờ lệch số.
3. **Chạy được từ Giai đoạn 3** khi chưa có DB, vì input là mock `Promotion[]`.

**⚠️ Luật bảo mật — nhớ kỹ:**
Client tính discount chỉ để **hiển thị**. Lúc tạo đơn, **server phải load lại `Dish` + `Promotion` từ DB rồi gọi `bestPromotion()` lần nữa**. Không bao giờ tin `discount` hay `total` client gửi lên. Bỏ qua bước này = ai cũng sửa được giá qua DevTools. Đây là câu hỏi phỏng vấn ruột — và cũng là câu chuyện hay nhất để kể về project này.

**Các edge case phải xử lý (và test):**

| Case | Xử lý |
|---|---|
| Khung giờ vắt qua nửa đêm (22:00–02:00) | `endTime < startTime` → so sánh OR thay vì AND |
| `PERCENT` làm tròn | `Math.floor(subtotal * value / 100)` — làm tròn xuống, có lợi cho quán, không sinh số lẻ |
| `FIXED` lớn hơn subtotal | `Math.min(discountValue, subtotal)` — discount không bao giờ vượt subtotal |
| Giỏ rỗng | Trả `null`, không chia cho 0 |
| Promo scope=DISH nhưng món không có trong giỏ | `computeDiscount` trả 0 → bị filter ra |
| 2 promo cùng giá trị giảm | `reduce` giữ cái đầu — ổn định, không random |

---

## 7. Các giai đoạn

Ước lượng theo **3–4 giờ/ngày**. Tổng ~**7–8 tuần**.

---

### GIAI ĐOẠN 0 — Khởi tạo · *0.5 ngày*

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
npx shadcn@latest init
npm i zustand react-hook-form zod @hookform/resolvers lucide-react
```

- [ ] `git init`, push GitHub **ngay** (commit history đẹp là thứ nhà tuyển dụng xem)
- [ ] `.gitignore` — chắc chắn có `dev.db`, `.env`
- [ ] Prettier + ESLint

---

### GIAI ĐOẠN 1 — Design system + Layout shell · *2.5 ngày*

- [ ] Đổ toàn bộ token mục 2.1 vào `globals.css`
- [ ] Font mục 2.2 — **test ngay chuỗi tiếng Việt có dấu**
- [ ] `components/shared/SectionHeading.tsx` + `OrnamentDivider.tsx` (pattern A)
- [ ] `components/shared/Price.tsx` — `formatVND()`, serif, gold
- [ ] `components/layout/TopBar.tsx` (pattern B)
- [ ] `components/layout/Header.tsx` — nav theo mục 2.4, sticky, active underline gold
- [ ] `components/layout/MobileNav.tsx` — Sheet drawer
- [ ] `components/layout/Footer.tsx`
- [ ] `src/types/index.ts` — copy nguyên mục 5
- [ ] `src/lib/data/_mock.ts` — 15 món, 5 category, **5 promotion đúng như ảnh mẫu**, 8 review

**Xong khi:** Header/Footer khớp Figma ở 375px và 1440px. Chữ tiếng Việt có dấu không vỡ font.

---

### GIAI ĐOẠN 2 — Trang chủ · *3 ngày*

Bám đúng thứ tự section trong ảnh mẫu:

- [ ] **Hero** — ảnh nền full-viewport + overlay tối, heading 3 dòng (dòng 2 serif *italic* gold), mô tả, 2 nút (đặc + viền)
  - Overlay: `bg-gradient-to-b from-black/70 via-black/50 to-background` — cần đủ tối để chữ đọc được nhưng vẫn thấy lửa
  - ⚠️ Ảnh hero phải `priority` + `sizes="100vw"`, không sẽ tụt LCP
- [ ] **Khuyến mãi nổi bật** — `SectionHeading` + grid 3 cột (5 card → 3+2 như ảnh)
- [ ] **Chuẩn mực Beefsteak** — `SectionHeading` + 4 card icon (icon lucide trong ô viền gold)
- [ ] **Xem trước thực đơn** — ảnh lớn trái + list món phải (thumbnail | tên · giá gold | mô tả)
- [ ] **Review khách hàng**
- [ ] **CTA đặt bàn** cuối trang

---

### GIAI ĐOẠN 3 — Khuyến mãi + Thực đơn · *5 ngày*

**Ngày 1–2 — Khuyến mãi**
- [ ] `components/promotion/PromoCard.tsx` — pattern C (badge đôi), meta line có icon lịch, nút viền
- [ ] `khuyen-mai/page.tsx` — grid đầy đủ
- [ ] `khuyen-mai/[slug]/page.tsx` — chi tiết + điều kiện áp dụng + nút "Đặt bàn với ưu đãi này"
- [ ] Nút Reserve dẫn sang `/dat-ban?promo=steak-night` (prefill)

**Ngày 3–4 — Thực đơn**
- [ ] `thuc-don/page.tsx` — grid + filter category
- [ ] Filter bằng **URL searchParams** (`?category=steak`), không dùng `useState`. Lý do: link share được, back button chạy đúng, giữ được Server Component nên không tốn JS client.
- [ ] `DishCard`, `loading.tsx` skeleton, empty state

**Ngày 5 — Chi tiết món**
- [ ] Ảnh lớn, mô tả, giá, khối lượng, chọn độ chín + số lượng + ghi chú
- [ ] Review list + phân bố rating (UI, chưa submit)
- [ ] Món liên quan, `generateMetadata()`, `not-found.tsx`

---

### GIAI ĐOẠN 4 — Discount engine · *2 ngày*

> Làm **trước** giỏ hàng — vì giỏ hàng cần nó để hiện giá.

- [ ] `lib/promotions/apply.ts` — toàn bộ mục 6
- [ ] **Vitest ngay tại đây**, phủ hết bảng edge case mục 6
- [ ] Đây là bài test dễ viết nhất và có giá trị nhất project. Đừng để đến Giai đoạn 11.

**Xong khi:** `npm test` xanh, có ~10 test case.

---

### GIAI ĐOẠN 5 — Giỏ hàng + Đặt bàn (UI) · *5 ngày*

**Ngày 1–2 — Cart**
- [ ] `store/cart.ts` — Zustand + `persist`
  - Key hợp nhất item = `dishId + doneness + note` (cùng món khác độ chín = 2 dòng riêng)
- [ ] `CartDrawer` mở từ Header, `gio-hang/page.tsx`, cart badge
- [ ] Gọi `bestPromotion()` → hiện dòng "Ưu đãi: Steak Night −30%"
- [ ] ⚠️ **Hydration mismatch** — `persist` đọc localStorage sau khi SSR xong, render thẳng cart badge sẽ lệch server/client. Fix: `useEffect` set `mounted`, chưa mounted thì render badge rỗng.

**Ngày 3 — Checkout**
- [ ] Form: tên, SĐT, địa chỉ, ghi chú, hình thức (giao/lấy tại quầy)
- [ ] Zod schema → `lib/validations/order.ts`
- [ ] Tóm tắt: tạm tính → giảm giá → phí ship → tổng
- [ ] Submit → `console.log`, trang thành công

**Ngày 4–5 — Đặt bàn**
- [ ] `<input type="date">` với `min` = hôm nay. **Không cài date picker library.** Native accessible sẵn, mobile ra UI đẹp hơn mọi lib.
- [ ] Khung giờ — grid button (17:00 → 21:30), disable giờ đã qua nếu chọn hôm nay
- [ ] Đọc `?promo=` → hiện banner ưu đãi đã chọn
- [ ] Zod validate (SĐT VN: `/^0[35789]\d{8}$/`)

---

### GIAI ĐOẠN 6 — Admin UI (mock) · *3 ngày*

- [ ] `admin/layout.tsx` — sidebar + topbar (chưa guard)
- [ ] `admin/page.tsx` — 4 stat card + bảng đơn gần đây
- [ ] `admin/dishes` — data table, search, sort + form new/edit
- [ ] `admin/promotions` — table + form (chọn scope, ngày trong tuần, khung giờ)
- [ ] `admin/reservations` + `admin/orders` — table + đổi trạng thái

---

## 🎯 **CHỐT FRONTEND** — cuối tuần 4

- [ ] Responsive 375 / 768 / 1440 không vỡ
- [ ] Tab đi hết mọi nút, focus ring thấy rõ trên nền tối
- [ ] Contrast: chữ muted `#A29B93` trên `#0F0D0C` — kiểm bằng DevTools, cần ≥ 4.5:1
- [ ] Mọi ảnh có `alt`, console không warning
- [ ] `npm run build` pass
- [ ] **Deploy Vercel ngay** — có link demo sớm, mỗi commit sau biết build còn xanh không
- [ ] Screenshot cho README

---

### GIAI ĐOẠN 7 — Database · *2 ngày*

```bash
npm i prisma @prisma/client && npx prisma init --datasource-provider sqlite
```

- [ ] `schema.prisma` — dịch nguyên `src/types/index.ts` sang model, theo đúng quy tắc cuối mục 5
- [ ] Index: `Dish.slug @unique`, `Promotion.slug @unique`, `Reservation.date`, `Order.code @unique`
- [ ] `avgRating`/`reviewCount` trên `Dish` → **cột lưu sẵn**, cập nhật khi có review mới. Không tính lại mỗi query.
- [ ] `npx prisma migrate dev --name init`
- [ ] `prisma/seed.ts` — bê thẳng `_mock.ts` vào (đây là lý do mock phải khớp type)
- [ ] `src/lib/prisma.ts` — singleton, tránh tạo lại connection khi hot-reload

---

### GIAI ĐOẠN 8 — Auth · *2 ngày*

```bash
npm i next-auth@beta bcryptjs
```

- [ ] NextAuth v5: Credentials (`bcrypt.compare`) + Google, `role` vào JWT + session
- [ ] `middleware.ts` — chặn `/admin/*` (ADMIN) và `/tai-khoan/*` (đã login)
- [ ] Nối login/register form đã dựng, Header hiện avatar dropdown

⚠️ **Chỗ dễ sai nhất.** Middleware chỉ chặn ở tầng route — **vẫn phải check role lại trong từng Server Action**. Không thì gọi thẳng action là xóa được món.

---

### GIAI ĐOẠN 9 — Nối data thật · *5 ngày*

Thu hoạch công sức Giai đoạn 4 + 5. Từng file trong `lib/data/`, thay ruột mock bằng Prisma. **Page không sửa.**

- [ ] `dishes.ts`, `promotions.ts`, `reviews.ts` → Prisma
- [ ] Server Action `createReservation` — Zod validate lại ở server, check trùng khung giờ
- [ ] Server Action `createOrder`:
  - ⚠️ Load `Dish` + `Promotion` từ DB, gọi lại `bestPromotion()`. **Không tin số client gửi.**
  - Snapshot `unitPrice` + `appliedPromotionTitle` vào đơn
  - Sinh mã đơn (`BS-20260717-001`)
  - `prisma.$transaction` — order + items cùng thành công hoặc cùng fail
- [ ] Clear cart sau khi đặt, `revalidatePath()` sau mutation
- [ ] `/tai-khoan/don-hang`, `/tai-khoan/dat-ban` — data thật
- [ ] `app/api/menu/route.ts` — REST endpoint public (`?category=&search=&page=`)
- [ ] Xóa `_mock.ts`

---

### GIAI ĐOẠN 10 — Review · *2 ngày*

- [ ] Server Action `createReview` — chỉ user đã login
- [ ] `@@unique([userId, dishId])` — 1 user 1 review / món
- [ ] Cập nhật `avgRating` + `reviewCount` trong **cùng transaction** với review
- [ ] `useOptimistic` — review hiện ngay, rollback nếu lỗi
- [ ] Sửa/xóa review của chính mình

---

### GIAI ĐOẠN 11 — Admin backend · *3 ngày*

- [ ] CRUD món + **CRUD khuyến mãi** (Server Actions, check role trong **từng** action)
- [ ] Upload ảnh — UploadThing
- [ ] Đổi trạng thái booking/order
- [ ] Stat: doanh thu tháng, số đơn, booking hôm nay, món bán chạy — `prisma.aggregate` / `groupBy`
- [ ] Phân trang server-side qua searchParams

---

### GIAI ĐOẠN 12 — Hoàn thiện · *3 ngày*

- [ ] SEO: `generateMetadata` mọi page, `sitemap.ts`, `robots.ts`, OG image
- [ ] JSON-LD `Restaurant` + `Menu` — Google hiện rich result, điểm cộng thật
- [ ] `error.tsx` + `not-found.tsx` toàn cục
- [ ] Rate limit đặt bàn (đơn giản: 1 SĐT tối đa 3 booking/ngày, check trong DB)
- [ ] **Vitest** — bổ sung: tính tiền giỏ, `formatVND`, validate SĐT (engine đã test ở GĐ 4)
- [ ] **Playwright** — 3 luồng: (1) thêm món → checkout → thấy đơn, (2) đặt bàn, (3) promo tự áp giảm giá
- [ ] GitHub Actions: lint + build + test mỗi push

---

### GIAI ĐOẠN 13 — Deploy production · *1 ngày*

- [ ] Neon project → `DATABASE_URL`
- [ ] `provider = "sqlite"` → `"postgresql"`; xóa `prisma/migrations/`, `migrate dev --name init` lại
- [ ] Seed lên Neon
- [ ] Vercel env: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, `UPLOADTHING_TOKEN`
- [ ] `"build": "prisma generate && next build"`
- [ ] Tài khoản demo (`demo@…` / `demo1234`) để nhà tuyển dụng bấm thử không cần đăng ký

---

### GIAI ĐOẠN 14 — Đóng gói cho CV · *0.5 ngày*

- [ ] README: screenshot, link demo, tài khoản demo, tech stack, cách chạy local, sơ đồ DB
- [ ] Ghi rõ **3 vấn đề khó nhất bạn giải** — đây là thứ được hỏi trong phỏng vấn:
  1. **Discount engine** — hàm thuần, dùng chung client/server, server luôn tính lại để chống sửa giá
  2. **Tách `lib/data/`** — build xong frontend rồi thay DB vào mà không sửa page nào
  3. **Snapshot dữ liệu lịch sử** — đơn hàng giữ giá và tên khuyến mãi tại thời điểm đặt

---

### GIAI ĐOẠN 15 — Optional

Chỉ khi đã xong hết trên: Blog/Community CMS · VNPay/Momo sandbox · Email xác nhận (Resend) · i18n

---

## 8. Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Làm nhiều mảng cùng lúc → không xong mảng nào | Xong hẳn từng mảng mới sang mảng khác. Đừng làm 50% cả 6. |
| Frontend làm mãi không xong, hết giờ cho backend | **Deadline cứng: chốt frontend cuối tuần 4.** Chưa đẹp cũng chuyển sang DB. |
| Font vỡ chữ tiếng Việt phát hiện muộn | Test chuỗi có dấu ngay Giai đoạn 1, không đợi đến lúc đổ nội dung. |
| Discount engine đẻ bug lúc checkout | Test ở Giai đoạn 4, trước khi bất kỳ UI nào phụ thuộc vào nó. |
| Đổi SQLite → Postgres phút chót vỡ trận | Deploy Vercel từ mốc chốt frontend; đổi Postgres ở GĐ 13 chứ không phải ngày cuối. |
| Mock data không khớp Prisma schema | Viết `src/types/index.ts` **trước**, cả mock và schema đều bám theo nó. |

---

## 9. Bước tiếp theo

Giai đoạn 0 + 1: khởi tạo project, đổ design token, dựng Header/Footer/SectionHeading, viết types + mock.
