export interface Notification {
  id: string;
  accountId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: number;
  status: number;
  createdDate: string;
  lastUpdated: string;
  statusText: string;
  typeText: string;
}

export enum NotificationStatus {
  UNREAD = 1,
  READ = 2,
  DELETED = 0
}

export enum NotificationType {
  PAYMENT_SUCCESS = 1,
  SYSTEM = 2,
  COURSE = 3,
  ROBOT = 4
}
