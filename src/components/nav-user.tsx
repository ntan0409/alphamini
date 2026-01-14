"use client"

import {
  ChevronsUpDown,
  LogOut,
  User,
} from "lucide-react"

import {
  Avatar,
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
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useRouter } from "next/navigation"
import { getTokenPayload } from "@/utils/tokenUtils"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  
  // Initialize the logout mutation hook at component top-level
  const logoutMutation = useLogout()

  const logOut = () => {
    // Trigger the mutation when user clicks Log out
    logoutMutation.mutate()
  }

  const navigateToProfile = () => {
    // Get user role from token to determine profile URL
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      const accountData = getTokenPayload(accessToken)
      const roleName = accountData?.roleName?.toLowerCase()
      
      // Navigate based on role
      if (roleName === 'admin') {
        router.push('/admin/profile')
      } else if (roleName === 'staff') {
        router.push('/staff/profile')
      } else if (roleName === 'parent' || roleName === 'user') {
        router.push('/parent/profile')
      } else if (roleName === 'child') {
        router.push('/children/profile')
      }
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={navigateToProfile}
                className="hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                <User />
                Hồ Sơ
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut} className="hover:bg-red-100 hover:text-red-900 transition-colors duration-200 cursor-pointer">
              <LogOut />
              Đăng Xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
