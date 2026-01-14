import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { magicSketchApi } from "../api/magic-sketch-api";

const KEYS = {
  LIST: "sketch-list",
};

// Hook lấy danh sách
// Hook lấy danh sách (Update thêm tham số page)
export const useGetSketchList = (accountId: string | null, page: number = 1) => {
  return useQuery({
    queryKey: [KEYS.LIST, accountId, page], // Thêm page vào key để cache từng trang
    queryFn: () => magicSketchApi.getSketchList(accountId || "", page),
    enabled: !!accountId,
    placeholderData: (previousData) => previousData, 
  });
};

// Hook Upload ảnh mới
export const useUploadCapture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, accountId, description }: { file: File; accountId: string; description?: string }) =>
      magicSketchApi.uploadCapture(file, accountId, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
  });
};

// Hook Generate Video
export const useGenerateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) => 
      magicSketchApi.generateVideoById(id, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
  });
};

export const useDeleteCapture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => magicSketchApi.deleteCapture(id),
    onSuccess: () => {
      // Invalidate để load lại danh sách sau khi xóa
      queryClient.invalidateQueries({ queryKey: [KEYS.LIST] });
    },
  });
};