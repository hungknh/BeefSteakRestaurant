import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center border-b border-border px-6">
          <p className="text-sm text-muted-foreground">Bảng Quản Trị</p>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
