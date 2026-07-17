export type Role = "USER" | "ADMIN";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "SEATED" | "CANCELLED" | "NO_SHOW";
export type Doneness = "RARE" | "MEDIUM_RARE" | "MEDIUM" | "MEDIUM_WELL" | "WELL_DONE";
export type DiscountType = "PERCENT" | "FIXED" | "NONE";
export type PromoScope = "ALL" | "CATEGORY" | "DISH";

export type Category = { id: string; name: string; slug: string; sortOrder: number };

export type Dish = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Int, đơn vị VNĐ
  imageUrl: string;
  categoryId: string;
  category?: Category;
  isAvailable: boolean;
  isFeatured: boolean;
  weightGram: number | null;
  hasDoneness: boolean;
  avgRating: number;
  reviewCount: number;
};

export type Promotion = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  // Hiển thị — đúng như 2 badge trong design
  badgeLabel: string; // "PHỔ BIẾN NHẤT" | "HÀNG NGÀY" | "LÃNG MẠN" | "CUỐI TUẦN"
  badgeOffer: string; // "GIẢM 30%" | "TẶNG MÓN PHỤ"
  scheduleText: string; // "THỨ 5 HÀNG TUẦN" | "T2-T6, 17:00-19:00"
  // Logic tính tiền
  discountType: DiscountType;
  discountValue: number; // PERCENT: 0-100 | FIXED: số VNĐ
  scope: PromoScope;
  targetCategoryId: string | null;
  targetDishId: string | null;
  daysOfWeek: string; // "1,4,6" (0=CN). Rỗng = mọi ngày
  startTime: string | null; // "17:00"
  endTime: string | null; // "19:00"
  minSubtotal: number; // 0 = không yêu cầu
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type User = { id: string; name: string; email: string; image: string | null; role: Role };

export type Reservation = {
  id: string;
  userId: string | null;
  promotionId: string | null;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string;
  partySize: number;
  note: string | null;
  status: ReservationStatus;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  dishId: string;
  dish?: Dish;
  quantity: number;
  unitPrice: number;
  doneness: Doneness | null;
  note: string | null;
};

export type Order = {
  id: string;
  code: string;
  userId: string | null;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedPromotionId: string | null;
  appliedPromotionTitle: string | null; // snapshot lịch sử, xem PLAN.md mục 5
  receiverName: string;
  receiverPhone: string;
  address: string;
  createdAt: string;
};

export type Review = {
  id: string;
  dishId: string;
  userId: string;
  user?: User;
  rating: number;
  content: string;
  createdAt: string;
};
