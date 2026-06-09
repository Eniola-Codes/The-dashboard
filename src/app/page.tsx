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
          <Suspense fallback={<div className="flex flex-col gap-4 md:gap-6">
            <div className="sticky top-0 z-20 border-b bg-background px-4 py-3 lg:px-6">
              <div className="h-9 w-full max-w-md animate-pulse rounded-md bg-muted" />
            </div>
          </div>}>
            <PipelineDashboard />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
