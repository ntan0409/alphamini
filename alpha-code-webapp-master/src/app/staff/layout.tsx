"use client"

import React from "react"
import { StaffSidebar } from "@/components/staff-sidebar"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { AuthGuard } from "@/components/auth-guard"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Function to format path segments into a display name
function formatPathToDisplayName(path: string): string {
  return path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function StaffBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [];

  // Nếu là trang chính staff, hiển thị Nhân viên -> Bảng điều khiển
  if (pathname === '/staff') {
    breadcrumbItems.push({
      href: '/staff',
      label: 'Nhân viên',
      isLast: false
    });
    breadcrumbItems.push({
      href: '/staff',
      label: 'Trang chủ',
      isLast: true
    });
  } else {
    // Nếu là trang con, hiển thị Nhân viên -> Tên trang hiện tại
    breadcrumbItems.push({
      href: '/staff',
      label: 'Nhân viên',
      isLast: false
    });
    
    // Lấy tên trang từ segment cuối cùng
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Chuyển đổi segment thành tên hiển thị tiếng Việt
    let currentPageName = '';
    switch (lastSegment) {
      case 'categories':
        currentPageName = 'Danh mục'; break;
      case 'courses':
        currentPageName = 'Khóa học'; break;
      case 'sections':
        currentPageName = 'Chương'; break;
      case 'lessons':
        currentPageName = 'Bài học'; break;
      case 'new':
        currentPageName = 'Tạo mới'; break;
      case 'edit':
        currentPageName = 'Chỉnh sửa'; break;
      case 'video-submissions':
        currentPageName = 'Bài nộp'; break;
      default:
        currentPageName = formatPathToDisplayName(lastSegment);
    }
    
    // Xử lý breadcrumb cho các trang lồng nhau
    if (pathSegments.length > 2) {
      // Ví dụ: /staff/categories/[id]/courses
      for (let i = 1; i < pathSegments.length - 1; i++) {
        const segment = pathSegments[i];
        let segmentName = '';
        
        switch (segment) {
          case 'categories':
            segmentName = 'Danh mục'; break;
          case 'courses':
            segmentName = 'Khóa học'; break;
          case 'sections':
            segmentName = 'Chương'; break;
          case 'lessons':
            segmentName = 'Bài học'; break;
          default:
            // Nếu là UUID, bỏ qua
            if (segment.length === 36 && segment.includes('-')) {
              continue;
            }
            segmentName = formatPathToDisplayName(segment);
        }
        
        if (segmentName) {
          breadcrumbItems.push({
            href: `/${pathSegments.slice(0, i + 1).join('/')}`,
            label: segmentName,
            isLast: false
          });
        }
      }
    }
    
    breadcrumbItems.push({
      href: pathname,
      label: currentPageName,
      isLast: true
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}-${item.href.replace(/\//g, '-')}`}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator className="hidden md:block" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard allowedRoles={['Staff']}>
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <StaffBreadcrumb />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-5">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
