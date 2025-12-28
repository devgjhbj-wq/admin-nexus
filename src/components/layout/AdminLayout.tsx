import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet, Navigate } from "react-router-dom";
import { getAuthToken, getAdminUser } from "@/lib/api";
import { InstallAppButton } from "@/components/InstallAppButton";

export function AdminLayout() {
  const token = getAuthToken();
  const user = getAdminUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-12 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <InstallAppButton />
              {user && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {user.userId}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Admin
              </span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
