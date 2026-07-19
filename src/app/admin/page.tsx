import { UtensilsCrossed, Tag, CalendarCheck, ShoppingBag } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Price } from "@/components/shared/price";
import { getDishes } from "@/lib/data/dishes";
import { getPromotions } from "@/lib/data/promotions";
import { getReservations } from "@/lib/data/reservations";
import { getOrders } from "@/lib/data/orders";

export const metadata = { title: "Admin — Tổng Quan" };

export default async function AdminDashboardPage() {
  const [dishes, promos, reservations, orders] = await Promise.all([
    getDishes(),
    getPromotions(),
    getReservations(),
    getOrders(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const reservationsToday = reservations.filter((r) => r.date === today).length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={UtensilsCrossed}
          label="Tổng Món Ăn"
          value={String(dishes.length)}
        />
        <StatCard
          icon={Tag}
          label="Khuyến Mãi Đang Chạy"
          value={String(promos.length)}
        />
        <StatCard
          icon={CalendarCheck}
          label="Đặt Bàn Hôm Nay"
          value={String(reservationsToday)}
        />
        <StatCard
          icon={ShoppingBag}
          label="Tổng Đơn Hàng"
          value={String(orders.length)}
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-serif text-lg text-foreground">
            Đơn Hàng Gần Đây
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Mã Đơn</th>
                <th className="px-5 py-3 font-medium">Khách Hàng</th>
                <th className="px-5 py-3 font-medium">Tổng Tiền</th>
                <th className="px-5 py-3 font-medium">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-3 text-foreground">{order.code}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {order.receiverName}
                  </td>
                  <td className="px-5 py-3">
                    <Price amount={order.total} className="text-sm" />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
