import { Suspense } from "react"
import { AppSidebar } from "@/components/layout/sidebar"
import { PipelineDashboard } from "@/components/pipeline"
import { NavHeader } from "@/components/layout/nav-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <NavHeader />
        <div className="@container/main flex flex-col gap-4 rounded-xl bg-background shadow-sm md:gap-6 pb-2 md:pb-4">
          <Suspense fallback={<></>}>
            <PipelineDashboard />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
