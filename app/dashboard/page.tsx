'use client'

//import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import PortfolioList from '@/app/portfolio-list/components/portfoliolist'
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter();
  return (
    <SidebarProvider>
      {/* <AppSidebar/> */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            < Breadcrumb />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 p-4">
        <div>
         <h1 className="text-3xl font-heading font-bold text-foreground">Welcome to RayDawn Admin</h1>
         <p className="mt-1 text-muted-foreground">Manage your portfolio content from here</p>
        </div>
        <button 
          onClick={()=>router.push('/upload')}
          className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#F57C1F] to-[#0F9B99] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
          >
          + Add New Item
         </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-transparent p-0 flex flex-col border-2 border-gradient-to-r from-[#F57C1F] to-[#0F9B99]">
          <h3 className="font-heading text-4xl font-bold text-foreground p-4 pb-0">Portfolio Items</h3>
          <div className="flex flex-col items-start gap-2 justify-center flex-grow px-4">
            <p className="text-8xl font-semibold text-[#0F9B99]">12</p>
            <p className="mt-1 text-1xl font-medium text-muted-foreground">Total portfolio items</p>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-transparent p-0 flex flex-col border-2 border-gradient-to-r from-[#F57C1F] to-[#0F9B99]" >
          <h3 className="font-heading text-4xl font-bold text-foreground p-4 pb-0">Categories</h3>
          <div className="flex flex-col items-start gap-2 justify-center flex-grow px-4">
            <p className="text-8xl font-semibold text-[#F57C1F]">5</p>
            <p className="mt-1 text-1xl font-medium text-muted-foreground">Different content categories</p>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-transparent p-0 flex flex-col border-2 border-gradient-to-r from-[#F57C1F] to-[#0F9B99]" >
          <h3 className="font-heading text-4xl font-bold text-foreground p-4 pb-0">Clients</h3>
          <div className="flex flex-col items-start gap-2 justify-center flex-grow px-4">
            <p className="text-8xl font-semibold text-[#0F9B99]">8</p>
            <p className="mt-1 text-1xl font-medium text-muted-foreground">Total clients featured</p>
          </div>
        </div>
          </div>
          <Card className="bg-transparent p-6 rounded-lg shadow-md border-2 border-accent mb-8">
          <h2 className="text-4xl font-heading font-medium mb-4 text-foreground">Recent Portfolio Items</h2>
          <PortfolioList />
        </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
