"use client"

import * as React from "react"
import {
  BookOpen,
  Folder,
  Home,
  LifeBuoy,
  Send,
  Layers,
  FileText,
  Video
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

export function StaffSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState({
    name: "Staff",
    email: "",
    avatar: "/avatars/default.jpg",
  });

  // Các menu chính cho Staff
  const projects = React.useMemo(() => [
    {
      name: "Trang chủ",
      url: "/staff",
      icon: Home,
    },
    {
      name: "Hồ sơ",
      url: "/staff/profile",
      icon: Home,
    },
  ], []);

  React.useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      const accountData = getTokenPayload(accessToken);
      if (accountData) {
        setUserData({
          name: accountData.fullName || accountData.username || "Staff",
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
        title: "Quản lý nội dung",
        url: "/staff",
        icon: BookOpen,
        isActive: true,
        items: [
          {
            title: "Danh mục",
            url: "/staff/categories",
          },
          {
            title: "Khóa học",
            url: "/staff/courses",
          },
          {
            title: "Bài học",
            url: "/staff/lessons",
          },
        ],
      },
      {
        title: "Bài kiểm tra",
        url: "/staff/video-submissions",
        icon: Video,
        items: [
          {
            title: "Bài nộp",
            url: "/staff/video-submissions",
          },
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
