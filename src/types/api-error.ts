// Types cho error handling
export interface ApiResponse {
  success: boolean;
  error: string | null;
  message: string | null;
  timestamp: string;
  status: number;
}