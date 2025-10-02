import { ThemeProvider } from "../theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { ThemeToggle } from "../theme-toggle";
import Dashboard from "@/pages/dashboard";

export default function DashboardExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <ThemeProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b p-2 flex justify-end">
            <ThemeToggle />
          </div>
          <div className="p-6">
            <Dashboard />
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
