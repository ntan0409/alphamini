import { Color } from "./color"

export interface ActionActivites {
  action_id: string;
  start_time: number;
  duration: number;
  action_type: string;
  color: Color[];
}

export interface ActivityData {
  activity?: {
    actions?: ActionActivites[];
    [key: string]: unknown;
  };
  music_info?: {
    name?: string;
    duration?: number;
    [key: string]: unknown;
  };
  content?: string;
  [key: string]: unknown;
}

export type Activity = {
  id: string;
  accountId: string;
  data: ActivityData; // Object containing activity and music_info
  name: string;
  status: number;
  type: string;
  createdDate: string;
  lastUpdated: string;
  statusText: string;
  robotModelId: string;
}

export type ActivitiesResponse = {
  data: Activity[];
  has_next: boolean;
  has_previous: boolean;
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}