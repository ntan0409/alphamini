// src/types/addon.ts
export enum AddonCategory {
  OSMO = 1,
  QRCODE = 2,
  DANCE = 3, // NHẢY THEO NHẠC
  BILINGUAL = 4, // NÓI SONG NGỮ
  JOYSTICK = 5, // ĐIỀU KHIỂN BẰNG CẦN ĐIỀU KHIỂN
  VOICE = 6, // ĐIỀU KHIỂN BẰNG GIỌNG NÓI
  SMART_HOME = 7, // NHÀ THÔNG MINH
}

export enum AddonStatus {
  DELETED = 0,
  ACTIVE = 1,
  INACTIVE = 2,
}

export const AddonCategoryText: Record<number, string> = {
  1: "OSMO",
  2: "QR CODE",
  3: "NHẢY THEO NHẠC",
  5: "ĐIỀU KHIỂN BẰNG CẦN ĐIỀU KHIỂN",
  7: "NHÀ THÔNG MINH",
}

export const AddonStatusText: Record<number, string> = {
  0: "ĐÃ XÓA",
  1: "ĐANG HOẠT ĐỘNG",
  2: "KHÔNG HOẠT ĐỘNG",
}

export type Addon = {
  id: string
  name: string
  description: string
  price: number
  category: AddonCategory
  categoryText?: string
  status: AddonStatus
  statusText?: string
  createdDate: string
  lastUpdated: string
}

export type AddonModal = {
  id?: string
  name: string
  description: string
  price: number
  category: AddonCategory
  status?: number
}

export type AddonPaginationResponse = {
  data: Addon[]
  total_pages: number
  total_count: number
}

export interface ValidateAddon {
  key?: string;
  accountId?: string;
  category?: number;
}