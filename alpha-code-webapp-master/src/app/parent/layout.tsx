"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { AccountData } from "@/types/account";
import { UserHeader } from "@/components/parent/user-header";
import { UserSidebar } from "@/components/parent/user-sidebar";
import { Activity, BookPlus, Bot, Gamepad, Home, LayoutDashboard, Music, QrCode, HomeIcon ,  Wand2 } from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  const pathname = usePathname();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Lấy thông tin account từ token
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

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/parent", icon: LayoutDashboard },
    { name: "Smart Home", href: "/parent/smart-home", icon: HomeIcon },
    { name: "Robots", href: "/parent/robot", icon: Bot },
    { name: "Tay Cầm Điều Khiển", href: "/parent/joystick", icon: Gamepad },
    { name: "Hoạt Động Robot", href: "/parent/activities", icon: Activity },
    { name: "Âm Nhạc", href: "/parent/music", icon: Music },
    { name: "Mã QR", href: "/parent/qr-codes", icon: QrCode },
    { name: "Khoá học của tôi", href: "/parent/courses/my-course", icon: BookPlus },
    { name: "Phép thuật tranh vẽ", href: "/parent/magic-sketch", icon: Wand2 },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      // Home chỉ active khi đúng route gốc
      return pathname === "/";
    }

    if (href === "/parent") {
      // Dashboard chỉ active chính xác ở /parent
      return pathname === "/parent";
    }

    // Các route khác: active nếu pathname bắt đầu bằng href
    return pathname?.startsWith(href);
  };


  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Robot change handler is now handled by Redux
  // const handleRobotChange = (robot: Robot) => {
  //   setCurrentRobot(robot);
  // };

  return (
    <AuthGuard allowedRoles={['Parent']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <UserHeader
          onToggleSidebar={handleToggleSidebar}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Sidebar */}
        <UserSidebar
          isSidebarOpen={isSidebarOpen}
          navigationItems={navigationItems}
          isActiveRoute={isActiveRoute}
          accountData={accountData}
          onLogout={handleLogout}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out pt-15 ${isSidebarOpen ? "md:ml-64 ml-0" : "md:ml-24 ml-0"
            }`}
        >
          <div className="mt-10 bg-white min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
