"use client" 

import logo from "@/public/images/logo.png"
import * as React from "react"
import {
  FolderPlus,
  Home,
  TableCellsMerge,
} from "lucide-react"
import { usePathname } from "next/navigation"; // Import usePathname for dynamic URL detection
import Link from "next/link";

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,  
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "RayDawn",
    email: "admin@raydawn.co.ke",
    avatar: logo.src,
  },
  teams: [{
      name: "RayDawn Communications",
      logo: logo.src,
    },],
}

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Upload Project",
    url: "/uploads",
    icon: FolderPlus,
  },
  {
    title: "Portfolio Items",
    url: "/portfolio-list",
    icon: TableCellsMerge,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const pathname = usePathname(); // Get the current URL path

  // Helper to determine if an item is active
  const isItemActive = (url: string) => pathname === url;

  return (
    <Sidebar 
      collapsible="icon" 
      className="custom-sidebar" 
      {...props}
    >
      <SidebarHeader className="pt-4 pl-3">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
        <SidebarGroupLabel className="text-[#0F9B99] font-semibold font-sans text-1xl pb-4">Manage Your Portfolio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="relative my-2 group">
                  <SidebarMenuButton 
                    asChild
                    className={`transition-all menu-item-button ${state === "collapsed" ? "justify-center" : ""}`}
                    data-active={isItemActive(item.url)}
                  >
                    <Link 
                      href={item.url}
                      className="relative group"
                    >
                      {/* Active indicator - gradient line */}
                      {isItemActive(item.url) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent rounded-r" />
                      )}
                      
                      {/* Icon wrapper with conditional styling */}
                      <div className={`flex items-center justify-center ${state === "collapsed" ? "w-10 h-10" : "w-8 h-8"}`}>
                        <item.icon
                          className={`transition-all ${isItemActive(item.url) ? "text-white" : "text-gray-400 group-hover:text-white"}`}
                          size={state === "collapsed" ? 24 : 20}
                        />
                      </div>
                      
                      {/* Title text */}
                      <span className={`${isItemActive(item.url) ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> 
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-800">
        <NavUser/>
      </SidebarFooter>
      <SidebarRail className="hover:after:bg-blue-500" />
      
      {/* CSS for customizing the sidebar */}
      <style jsx global>{`
        /* Black background for sidebar */
        [data-sidebar="sidebar"] {
          background-color: black !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        
        /* Override hover state for menu buttons */
        [data-sidebar="menu-button"]:hover {
          background-color: transparent !important;
        }
        
        /* Custom styling for team switcher */
        [data-sidebar="menu-button"] img {
          border-radius: 8px;
        }
        
        /* Adjust icon size in collapsed state */
        [data-collapsible="icon"] [data-sidebar="menu-button"] svg {
          width: 24px;
          height: 24px;
        }
        
        /* Gradient for active items */
        [data-sidebar="menu-button"][data-active="true"] {
          background-color: transparent !important;
          color: white !important;
        }
        
        /* Avatar styling */
        [data-sidebar="footer"] [data-sidebar="menu-button"] div[class*="Avatar"] {
          background: linear-gradient(to bottom right, #0d9488, #14b8a6);
          border-radius: 8px;
        }
      `}</style>
    </Sidebar>
  );
}

