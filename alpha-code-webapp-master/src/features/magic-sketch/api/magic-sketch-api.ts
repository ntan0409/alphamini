import { robotsHttp, pythonHttp } from "@/utils/http";
import { VideoCaptureResponse, UploadResponse, VideoCapture } from "@/types/magic-sketch";

export const magicSketchApi = {
  // 1. LẤY DANH SÁCH (GALLERY)
  getSketchList: async (accountId: string, page = 1, size = 8): Promise<VideoCaptureResponse> => {
    const response = await robotsHttp.get<VideoCaptureResponse>('/video-captures', {
      params: { 
        accountId, 
        page, 
        size 
      }
    });
    return response.data;
  },

  // 2. UPLOAD ẢNH MỚI
  uploadCapture: async (file: File, accountId: string, description?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("account_id", accountId);
    if (description) {
      formData.append("description", description);
    }

    const response = await pythonHttp.post("/video/capture/by-account", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // 3. TẠO VIDEO (GENERATE) - ĐÃ FIX LỖI 422 & TIMEOUT
  generateVideoById: async (id: string, description: string): Promise<VideoCapture> => {
    const response = await robotsHttp.post<VideoCapture>(
      `/video-captures/${id}/generate`, 
      JSON.stringify(description), // Body là chuỗi JSON: "nội dung"
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000, // Tăng thời gian chờ lên 60 giây
        
        // QUAN TRỌNG: Ngăn Axios tự động transform data (tránh lỗi double quotes)
        transformRequest: [(data) => data] 
      }
    );
    return response.data;
  },

  // 4. XÓA BẢN GHI
  deleteCapture: async (id: string): Promise<boolean> => {
    await robotsHttp.delete(`/video-captures/${id}`);
    return true;
  }
};