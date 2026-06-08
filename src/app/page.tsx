import { AppSidebar } from "@/components/layout/sidebar"
import { PipelineDashboard } from "@/components/pipeline-dashboard"
import { NavHeader } from "@/components/layout/nav-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <NavHeader />
        <div className="flex flex-col gap-4 px-2 pb-2 md:gap-6 md:px-4 md:pb-4">
          <div className="@container/main flex flex-col gap-4 rounded-xl bg-background py-4 shadow-sm md:gap-6 md:py-6">
            <PipelineDashboard />
            {/* <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={dashboard} /> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
