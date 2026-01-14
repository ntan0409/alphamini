export interface VideoCapture {
  id: string;
  image: string;      // URL ảnh
  videoUrl?: string;  // URL video (có thể null)
  accountId: string;
  isCreated: boolean; // true = đã có video
  description?: string;
  createdDate: string;
  lastUpdated?: string;
  status: number;     // 1 = Hoạt động
  statusText?: string;
}

export interface VideoCaptureResponse {
  data: VideoCapture[];
  page: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Response khi upload thành công từ Python Service
export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    video_capture_id: string;
    image_url: string;
    account_id: string;
  };
}