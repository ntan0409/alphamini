"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { AccountData } from "@/types/account";
import { ChildrenHeader } from "../../components/children/children-header";
import { ChildrenSidebar } from "../../components/children/children-sidebar";
import { Home, Blocks, BookOpen, Trophy, Video, Library, Info, Activity, Joystick, QrCode, Bot, HomeIcon, Wand2 } from "lucide-react";

interface ChildrenLayoutProps {
  children: React.ReactNode;
}

export default function ChildrenLayout({ children }: ChildrenLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        if (userInfo) {
          setAccountData({
            id: userInfo.id || "",
            username: userInfo.username || "",
            fullName: userInfo.fullName || "",
            email: userInfo.email || "",
            roleName: userInfo.roleName || "user",
            roleId: userInfo.roleId || "user",
          });
        }
      }
    }
  }, []);

  const iconClass = "w-5 h-5";
  const navigationItems = [
    { name: "Khám Phá", href: "/children", icon: <Info className={iconClass} /> },
    { name: "Smart Home", href: "/children/smart-home", icon: <HomeIcon className={iconClass} /> },
    { name: "Robot", href: "/children/robot", icon: <Bot className={iconClass} /> },
    { name: "Lập Trình", href: "/children/blockly-coding", icon: <Blocks className={iconClass} /> },
    { name: "Hoạt động", href: "/children/activities", icon: <Activity className={iconClass} /> },
    { name: "Điều khiển", href: "/children/joystick", icon: <Joystick className={iconClass} /> },
    { name: "Qr Codes", href: "/children/qr-codes", icon: <QrCode className={iconClass} /> },
    { name: "Khóa học của bé", href: "/children/courses/my-course", icon: <BookOpen className={iconClass} /> },
    { name: "Phép thuật tranh vẽ", href: "/children/magic-sketch", icon: <Wand2 className={iconClass} /> },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/children") {
      return pathname === "/children";
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthGuard allowedRoles={['Children']}>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Header */}
        <ChildrenHeader
          onToggleSidebar={handleToggleSidebar}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Sidebar */}
        <ChildrenSidebar
          isSidebarOpen={isSidebarOpen}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out pt-20 overflow-hidden ${isSidebarOpen ? "md:ml-72 ml-0" : "md:ml-24 ml-0"
            }`}
        >
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

