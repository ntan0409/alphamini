"use client";

import React from "react";
import Link from "next/link";
import { LogOut, UserCircle, Settings, Home as HomeIcon, Home, X } from "lucide-react";
import { SheetClose } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountData } from "@/types/account";
import { NavigationItem } from "@/types/user";
import { getUserRoleFromToken } from '@/utils/tokenUtils'

interface UserSidebarProps {
  isSidebarOpen: boolean;
  navigationItems: NavigationItem[];
  isActiveRoute: (href: string) => boolean;
  accountData: AccountData | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export function UserSidebar({
  isSidebarOpen,
  navigationItems,
  isActiveRoute,
  accountData,
  onLogout,
  isLogoutPending = false,
  mobileMode = false,
}: UserSidebarProps & { mobileMode?: boolean }) {
  const getUserRole = () => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken')
      if (accessToken) return getUserRoleFromToken(accessToken)
    }
    return null
  }

  const role = getUserRole()
  const myCourseHref = role === 'Children' ? '/children/courses/my-course' : '/parent/courses/my-course'
  return (
    <aside
      className={`${mobileMode ? 'block' : 'hidden md:fixed'} ${mobileMode ? 'relative' : 'md:top-16 md:left-0 md:h-[calc(100vh-4rem)]'} bg-white md:bg-white md:border-r md:border-gray-200 md:transition-all md:duration-300 md:ease-in-out z-30 ${mobileMode ? 'w-full' : 'md:flex md:flex-col'} ${isSidebarOpen ? (mobileMode ? 'w-full' : 'md:w-64') : (mobileMode ? 'w-full' : 'md:w-24')}`}
    >
      {/* Close button for mobile sheet */}
      {mobileMode && (
        <div className="absolute top-3 right-3 z-40">
          <SheetClose asChild>
            <button className="inline-flex items-center justify-center rounded-md bg-white/90 text-gray-700 hover:bg-white p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
          </SheetClose>
        </div>
      )}
      {/* Scrollable navigation */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden
        px-3 mt-10 pb-20
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400
      `}
      >
        <div className="space-y-1 w-full">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group relative ${isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <div
                  className={`text-xl flex items-center justify-center ${isSidebarOpen ? "mr-3" : "mx-auto"
                    }`}
                >
                  <item.icon />
                </div>

                {/* Text hiển thị khi mở rộng */}
                {isSidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip khi thu nhỏ */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Fixed user profile section at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        {isSidebarOpen ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full focus:outline-none">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 transition-colors cursor-pointer">
                  <Avatar className="h-11 w-11 border border-gray-300 shadow">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-blue-600 text-white font-medium">
                      {accountData?.fullName ? accountData.fullName.charAt(0).toUpperCase() : "T"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center">
                    <span className="font-semibold text-gray-900 text-base leading-tight truncate max-w-[140px] block">
                      {accountData?.fullName || "User"}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px] block">
                      {accountData?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
            {/* Đổi vị trí modal tại đây: side="top" | "bottom" | "left" | "right" */}
                <DropdownMenuContent className="w-56" side="top" align="center" sideOffset={12} forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{accountData?.fullName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{accountData?.email || "N/A"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/parent/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Hồ Sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={myCourseHref} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Khóa Học Của Tôi</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài Đặt</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} disabled={isLogoutPending}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng Xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex justify-center items-center py-3 focus:outline-none">
                <div className="flex items-center justify-center">
                  <Avatar className="h-11 w-11 border border-gray-300 shadow-sm">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="bg-blue-600 text-white font-medium text-lg flex items-center justify-center">
                      {accountData?.fullName
                        ? accountData.fullName.charAt(0).toUpperCase()
                        : "T"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {accountData?.fullName || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {accountData?.email || "N/A"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/user/profile" className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Hồ Sơ</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài Đặt</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} disabled={isLogoutPending}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng Xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  );
}
