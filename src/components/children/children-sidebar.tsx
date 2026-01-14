"use client";

import React from "react";
import Link from "next/link";
import { LogOut, UserCircle, Settings, Home as HomeIcon } from "lucide-react";
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

type NavItem = { name: string; href: string; icon: React.ReactNode };

interface ChildrenSidebarProps {
  isSidebarOpen: boolean;
  navigationItems: NavItem[];
  isActiveRoute: (href: string) => boolean;
  accountData: AccountData | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export function ChildrenSidebar({
  isSidebarOpen,
  navigationItems,
  isActiveRoute,
  accountData,
  onLogout,
  isLogoutPending = false,
}: ChildrenSidebarProps) {
  return (
    <aside
      className={`hidden md:fixed md:top-20 md:left-0 md:h-[calc(100vh-5rem)] md:backdrop-blur md:bg-white/80 md:border-r md:border-gray-200 md:transition-all md:duration-300 md:ease-in-out z-30 md:flex md:flex-col md:shadow-sm ${
        isSidebarOpen ? "md:w-72" : "md:w-20"
      }`}
    >
      {/* Scrollable navigation */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden px-4 mt-6 pb-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100`}
      >
        {/* Home shortcut */}
        <div className="mb-3">
          <Link
            href="/"
            className={`flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors group relative text-gray-800 hover:bg-blue-50`}
          >
            <div className={`text-lg flex items-center justify-center ${isSidebarOpen ? "mr-3" : "mx-auto"}`}>
              <HomeIcon />
            </div>
            {isSidebarOpen && <span className="truncate">Trang chủ</span>}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                Trang chủ
              </div>
            )}
          </Link>
        </div>

        <div className="space-y-1.5 w-full">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors group relative ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 hover:bg-blue-50"
                }`}
              >
                <div
                  className={`text-lg flex items-center justify-center ${
                    isSidebarOpen ? "mr-3" : "mx-auto"
                  }`}
                >
                  {item.icon}
                </div>

                {/* Text hiển thị khi mở rộng */}
                {isSidebarOpen && (
                  <span className="truncate">{item.name}</span>
                )}

                {/* Tooltip khi thu nhỏ */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-gray-200 bg-white/80 p-3">
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

