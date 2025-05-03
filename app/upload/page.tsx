'use client'
// This is the route for the upload page in the portfolio items section of the dashboard
import UploadForm from "@/app/upload/components/UploadForm"
import { AppSidebar } from "@/components/app-sidebar"
import BreadcrumbBar from "@/components/breadcrumber"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function UploadPage() {
  return (
    <>
    <SidebarProvider>
      <SidebarInset>
    <div>
      <BreadcrumbBar />
      <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white">Upload Portfolio Item</h1>
            <p className="mt-1 text-gray-400">Add new work to your portfolio collection</p>
          </div>
        </div> 
      <UploadForm />
      </div>
      </SidebarInset>
      </SidebarProvider>
    </>
  )
}
