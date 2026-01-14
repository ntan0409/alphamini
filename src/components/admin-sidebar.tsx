"use client"

import * as React from "react"
import {
  BarChart3,
  Bot,
  CreditCard,
  Home,
  LifeBuoy,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  BookMarkedIcon,
  QrCode,
  School,
  Upload
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo1 from '../../public/logo1.png';
import logo2 from '../../public/logo2.png';
import Image from "next/image"
import { getTokenPayload } from "@/utils/tokenUtils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState({
    name: "Admin",
    email: "",
    avatar: "/avatars/default.jpg",
  });

  // Dự án (Projects) - tiếng Việt
  const projects = React.useMemo(() => [
    {
      name: "Bảng điều khiển",
      url: "/admin",
      icon: Home,
    },
    {
      name: "Người dùng",
      url: "/admin/users",
      icon: Users,
    },
    {
      name: "Thẻ Osmo",
      url: "/admin/osmo-cards",
      icon: CreditCard,
    },
    {
      name: "Hồ sơ",
      url: "/admin/profile",
      icon: Users,
    }
  ], []);
  React.useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      const accountData = getTokenPayload(accessToken);
      if (accountData) {
        setUserData({
          name: accountData.fullName || accountData.username || "User",
          email: accountData.email || "",
          avatar: logo2.src || "/avatars/default.jpg",
        });
      }
    }
  }, []);

  const data = {
    user: userData,
    navMain: [
  {
    title: "Hoạt động",
    url: "/admin",
    icon: SquareTerminal,
    items: [
      { title: "Hành động", url: "/admin/activities/actions" },
      { title: "Điệu nhảy", url: "/admin/activities/dances" },
      { title: "Biểu cảm", url: "/admin/activities/expressions" },
      { title: "Kĩ năng", url: "/admin/activities/skills" },
      { title: "Hành động mở rộng", url: "/admin/activities/extended-actions" },
    ],
  },
  {
    title: "Mua thêm",
    url: "#",
    icon: CreditCard,
    items: [
      { title: "Gói đăng ký", url: "/admin/plan/subscription" },
      { title: "Tiện ích mở rộng", url: "/admin/plan/addons" },
      { title: "Gói kết hợp", url: "/admin/plan/bundle" },
    ],
  },
  {
    title: "Cài đặt",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Giá Key", url: "/admin/settings/key-price" },
      { title: "Giá Token", url: "/admin/settings/token-rule" },
    ],
  },
  {
    title: "Robots",
    url: "#",
    icon: Bot,
    items: [
      { title: "Phiên bản Robot", url: "/admin/robot-models" },
      { title: "APK", url: "/admin/apks" },
    ],
  },
],
    navSecondary: [
      {
        title: "Hỗ trợ",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Góp ý",
        url: "#",
        icon: Send,
      },
    ],
    projects: projects,
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="text-sidebar-primary-foreground flex aspect-square size-30 items-center justify-center rounded-lg">
                  <Image src={logo1} alt="Logo" className="object-contain w-30 h-30" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
