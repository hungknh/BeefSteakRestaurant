import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <p className="text-sm text-muted-foreground">Bảng Quản Trị</p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-foreground">{session?.user?.name}</p>
            <SignOutButton />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
