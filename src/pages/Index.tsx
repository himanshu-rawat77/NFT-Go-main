
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Index() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-violet-50 to-blue-50">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
