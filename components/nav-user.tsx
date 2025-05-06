"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/Authcontext"

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {

  const { user: authUser, logout } = useAuth()
  const { state } = useSidebar()
  const isSidebarCollapsed = state === "collapsed"

  if (!authUser) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="nav-user-button group"
            >
              {/* Use a gradient background for avatar if image fails */}
              <Avatar className={`${isSidebarCollapsed ? "w-10 h-10" : "w-8 h-8"} rounded-lg bg-gradient-to-br from-teal-500 to-teal-700`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg text-white">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {!isSidebarCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-medium text-white">{user.name}</span>
                  <span className="truncate text-xs text-gray-400">{user.email}</span>
                </div>
              )}
              
              {!isSidebarCollapsed && (
                <ChevronsUpDown className="ml-auto size-4 text-gray-400 group-hover:text-white transition-colors" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg bg-gray-900 border border-gray-800"
            side={isSidebarCollapsed ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-teal-500">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg text-white">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">{user.name}</span>
                  <span className="truncate text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
                <BadgeCheck className="text-teal-500" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-gray-800" />
            
            <DropdownMenuItem onClick={logout} className="text-gray-300 focus:text-white focus:bg-gray-800">
              <LogOut className="text-orange-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      
      {/* Custom styles */}
      <style jsx global>{`
        .nav-user-button {
          border-radius: 12px !important;
          background: transparent !important;
          transition: all 0.2s ease;
        }
        
        .nav-user-button:hover {
          background: transparent !important;
        }
        
        /* Custom dropdown styling */
        [data-radix-popper-content-wrapper] [role="menu"] {
          background-color: #111827 !important;
          border-color: #1f2937 !important;
        }
        
        [data-radix-popper-content-wrapper] [role="menuitem"] {
          transition: all 0.15s ease;
        }
        
        [data-radix-popper-content-wrapper] [role="menuitem"]:hover {
          background-color: rgba(59, 130, 246, 0.1) !important;
        }
        
        [data-radix-popper-content-wrapper] [role="menuitem"] svg {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      `}</style>
    </SidebarMenu>
  )
}