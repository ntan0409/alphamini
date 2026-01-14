"use client"

import * as React from "react"
import {
  Home,
  BookOpen,
  FileText
} from "lucide-react"
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
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function CourseSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [userData, setUserData] = React.useState({
    name: "Admin",
    email: "",
    avatar: "/avatars/default.jpg",
  });
  const navigationItems = React.useMemo(
    () => [
      {
        name: 'Home',
        url: "/courses",
        icon: Home,
      },
      {
        name: 'Learning Path',
        url: "/courses/learning-path",
        icon: BookOpen,
      },
      {
        name: 'Articles',
        url: "/courses/articles",
        icon: FileText,
      },
    ],
    [],
  )

  // if (isLoading) {
  //   return (
  //     <Sidebar variant="inset" {...props} className="w-40">
  //       <SidebarHeader>
  //         <SidebarMenu>
  //           <SidebarMenuItem>
  //             <SidebarMenuButton size="lg" asChild>
  //               <Link href="/courses">
  //                 <div className="text-sidebar-primary-foreground flex aspect-square size-30 items-center justify-center rounded-lg">
  //                   <Image src={logo1} alt="Logo" className="object-contain w-30 h-30" />
  //                 </div>
  //               </Link>
  //             </SidebarMenuButton>
  //           </SidebarMenuItem>
  //         </SidebarMenu>
  //       </SidebarHeader>
  //       <SidebarContent>
  //         <div className="p-4 space-y-2">
  //           <div className="animate-pulse space-y-2">
  //             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  //             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  //             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  //           </div>
  //         </div>
  //       </SidebarContent>
  //     </Sidebar>
  //   )
  // }

  return (
    // <div className="w-40">
    <Sidebar variant="inset" {...props}
      style={{
        // "--sidebar-width": "10rem",
        // "--sidebar-width-mobile": "20rem",
      }}
    > {/* narrower sidebar */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/courses">
                <div className="flex items-center justify-center py-4">
                  <Image src={logo1} alt="Logo" className="h-10 object-contain" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ul className="flex flex-col items-center gap-4 mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url
            return (
              <li key={item.url}>
                <Link
                  href={item.url}
                  className={`flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-colors 
                ${isActive
                      ? "text-blue-700 bg-blue-100"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                >
                  <Icon className={cn("h-6 w-6 mb-1 ")} />
                  <span className={cn("text-xs font-medium text-center")}>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </SidebarContent>

      <SidebarFooter className="mt-auto flex justify-center pb-4">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
    // </div>
  )
}