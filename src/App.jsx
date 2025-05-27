import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/radar/app-sidebar";
import Badges from "@/components/radar/header";

export function App() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-100 text-black">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4">
            <SidebarTrigger className="text-slate-800" />
            <Badges />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;
