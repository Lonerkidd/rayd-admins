"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: string
  }[]
}) {
  const { state } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const isSidebarCollapsed = state === "collapsed"

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="team-switcher-button gap-1"
        >
          <div className="flex items-center justify-center">
            <div className={`relative flex aspect-square items-center justify-center rounded-lg overflow-hidden ${
              isSidebarCollapsed ? "w-9 h-9" : "w-12 h-12"
            }`}>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-black"></div>
              
              {/* Logo image */}
              <Image
                width={isSidebarCollapsed ? 40 : 48}
                height={isSidebarCollapsed ? 40 : 48}
                src={activeTeam.logo} 
                alt={`${activeTeam.name} logo`}
                className='z-10'
              />
            </div>
          </div>
          
          {!isSidebarCollapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight ml-3">
              <span className="text-base font-bold text-white">{activeTeam.name}</span>
            </div>
          )}
          
          {!isSidebarCollapsed && (
            <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* Custom styles */}
      <style jsx global>{`
        .team-switcher-button {
          border-radius: 12px !important;
          transition: all 0.2s ease;
        }
        
        .team-switcher-button:hover {
          background: transparent !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </SidebarMenu>
  )
}