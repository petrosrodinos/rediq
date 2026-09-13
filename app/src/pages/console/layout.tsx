import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ConsoleLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="canvas-tex flex flex-1 flex-col gap-4 px-4 py-7 sm:px-7">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
