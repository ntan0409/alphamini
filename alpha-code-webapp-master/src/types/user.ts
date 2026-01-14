import { LucideIcon } from "lucide-react";

export interface Robot {
  name: string;
  status: "online" | "offline";
  avatar: string;
  id: string;
  battery: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon | string;
}