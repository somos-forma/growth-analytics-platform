import { cookies } from "next/headers";
import { ClientSwitch } from "@/components/client-switch";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Providers from "../providers";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <Providers>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <main className="grow">
          <header className="flex h-16 px-4 shrink-0 justify-between items-center gap-2">
            <div className="flex items-center gap-2 ">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Growth Analytics Platform</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex gap-5 items-center">
              <ClientSwitch />
              <ModeToggle />
            </div>
          </header>
          <div className="p-4">{children}</div>
        </main>
      </SidebarProvider>
    </Providers>
  );
}
