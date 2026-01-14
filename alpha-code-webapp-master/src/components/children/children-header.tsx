"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AccountData } from "@/types/account";
import { RobotSelector } from "../parent/robot-selector";
import Image from "next/image";
import { NotificationBell } from "@/components/notifications/notification-bell";
  
type NavItem = { name: string; href: string; icon: React.ReactNode };

interface ChildrenHeaderProps {
  onToggleSidebar: () => void;
  navigationItems: NavItem[];
  isActiveRoute: (href: string) => boolean;
  accountData: AccountData | null;
  onLogout: () => void;
  isLogoutPending?: boolean;
}

export function ChildrenHeader({
  onToggleSidebar,
  navigationItems,
  isActiveRoute,
  accountData,
  onLogout,
  isLogoutPending = false
}: ChildrenHeaderProps) {
  return (
    <header className="backdrop-blur bg-white/80 border-b border-gray-200 fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center space-x-6">
          {/* Menu Toggle for Desktop */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
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
            <SheetContent side="left" className="w-72 bg-white">
              <nav className="space-y-2 mt-8">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo/Title (clickable -> home) */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-14 h-14 overflow-hidden">
              <Image src="/img_edu_login.png" alt="Alpha Kids" fill sizes="36px" className="object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Alpha Kids</h1>
              <p className="text-xs text-gray-600">Học lập trình với Robot</p>
            </div>
          </Link>
        </div>

        {/* Right side - Notifications and Robot Selector */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <NotificationBell accountId={accountData?.id || null} />
          <RobotSelector/>
        </div>
      </div>
    </header>
  );
}

