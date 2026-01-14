"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  // Tự động mở section chứa trang hiện tại khi lần đầu mount
  useEffect(() => {
    const newOpenItems: Record<string, boolean> = {}
    items.forEach((item, index) => {
      const key = `${item.url}-${index}`
      // Kiểm tra nếu URL hiện tại nằm trong sub-items
      const isCurrentlyActive = item.items?.some(subItem => pathname.startsWith(subItem.url))
      if (isCurrentlyActive) {
        newOpenItems[key] = true
      }
    })
    // Chỉ set state nếu có thay đổi cần thiết
    setOpenItems(prev => {
      const hasChanges = Object.keys(newOpenItems).some(key => prev[key] !== newOpenItems[key])
      return hasChanges ? { ...prev, ...newOpenItems } : prev
    })
  }, [pathname, items])

  const handleOpenChange = (key: string, open: boolean) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: open
    }))
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Manage</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          const key = `${item.url}-${index}`
          const isOpen = openItems[key] ?? false
          const isCurrentlyActive = item.items?.some(subItem => pathname === subItem.url)

          return (
            <Collapsible 
              key={key} 
              asChild 
              open={isOpen}
              onOpenChange={(open) => handleOpenChange(key, open)}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem, subIndex) => {
                          const isActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={`${subItem.url}-${subIndex}`}>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
