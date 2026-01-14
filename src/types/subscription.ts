// Kiểu dữ liệu cơ bản API
export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string; // HTML
  price: number;
  billingCycle: number; // 1,3,9,12
  status: number;
  // statusText: string;
  createdDate: string;
  lastUpdated: string;
  // Optional để UI
  isRecommended?: boolean;  
  isCurrent?: boolean;
  buttonText?: string;
  badge?: string;
  note?: string;
}


export type SubscriptionPlanModal = {
  id: string
  name: string
  description: string
  price: number
  billingCycle: number
  // status?: number
  isRecommended : boolean
}

export type SubscriptionActivity = {
  planId: string
  startDate: string
  endDate?: string
  userId?: string
  status?: string
}