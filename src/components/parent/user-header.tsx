"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// Use updated visual for parent header
// Note: using public path for Next/Image
import { RobotSelector } from "./robot-selector";
import { UserSidebar } from "./user-sidebar";
import { AccountData } from "@/types/account";
import { NavigationItem } from "@/types/user";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface UserHeaderProps {
  onToggleSidebar: () => void;
  // Sidebar props for mobile
  navigationItems: NavigationItem[];
  isActiveRoute: (href: string) => boolean;
  accountData: AccountData | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export function UserHeader({
  onToggleSidebar,
  navigationItems,
  isActiveRoute,
  accountData,
  onLogout,
  isLogoutPending = false
}: UserHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Menu Toggle for Desktop */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            {/* Compact robot selector on mobile (avatar-only) */}
            <div className="lg:hidden ml-2">
              <RobotSelector compact className="" />
            </div>
            <SheetContent side="left" className="p-0 sm:max-w-xs">
              <UserSidebar
                mobileMode={true}
                isSidebarOpen={true}
                navigationItems={navigationItems}
                isActiveRoute={isActiveRoute}
                accountData={accountData}
                onLogout={onLogout}
                isLogoutPending={isLogoutPending}
              />
            </SheetContent>
          </Sheet>

          {/* Logo/Title (clickable -> home) */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-15 h-15 overflow-hidden">
              <Image src="/img_update.webp" alt="Alpha Parent" fill sizes="56px" className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Alpha Parent</h1>
              <p className="text-xs text-gray-600">Quản lý Robot và Học tập</p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications (always visible) */}
          <NotificationBell accountId={accountData?.id || null} />

          {/* Full Robot Selector for large screens only */}
          <div className="hidden lg:block">
            <RobotSelector />
          </div>
        </div>
      </div>
    </header>
  );
}