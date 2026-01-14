import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPagedRobotApks,
  getFilePath,
  createRobotApk,
  updateRobotApk,
  deleteRobotApk,
} from "../api/robot-apk-api";
import { PagedResult } from "@/types/page-result";
import {
  CreateRobotApkDto,
  RobotApk,
  UpdateRobotApkDto,
} from "@/types/robot-apk";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api-error";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiResponse | undefined;
    if (response?.message) {
      return response.message;
    }
    if (error.response?.status === 400) {
      return "Dữ liệu không hợp lệ";
    }
    if (error.response?.status === 409) {
      return "Dữ liệu đã tồn tại";
    }
    if (error.response?.status === 500) {
      return "Lỗi máy chủ, vui lòng thử lại sau";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Đã có lỗi xảy ra";
};


/**
 * 🧩 Lấy danh sách Robot APK có phân trang + tìm kiếm
 */
export const usePagedRobotApks = (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal
) =>
  useQuery<PagedResult<RobotApk>, Error>({
    queryKey: ["robot-apks", page, size, search],
    queryFn: () => getPagedRobotApks(page, size, search, signal),
    placeholderData: (previousData) => previousData,
  });

/**
 * 🧩 Lấy đường dẫn file APK
 * - Chỉ retry tối đa 2 lần
 * - Không retry nếu lỗi 403/404 (không có quyền hoặc chưa mua license)
 * - Nếu APK không yêu cầu license: gọi API ngay khi có apkId
 * - Nếu APK yêu cầu license: chỉ gọi API khi có cả apkId và accountId
 */
export const useFilePath = (apkId?: string, accountId?: string, isRequireLicense?: boolean) =>
  useQuery<string, Error>({
    queryKey: ["robot-apk-file-path", apkId, accountId],
    queryFn: () => getFilePath(apkId!, accountId),
    // Enabled logic:
    // - Nếu không yêu cầu license: chỉ cần có apkId
    // - Nếu yêu cầu license: cần có cả apkId và accountId
    enabled: !!apkId && (isRequireLicense ? !!accountId : true),
    retry: (failureCount, error: unknown) => {
      // Không retry nếu là lỗi 403/404 (không có quyền/chưa mua license)
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 403 || axiosError?.response?.status === 404) {
        return false;
      }
      // Chỉ retry tối đa 2 lần cho các lỗi khác
      return failureCount < 2;
    },
    retryDelay: 1000, // Đợi 1 giây trước mỗi lần retry
  });

/**
 * 🟢 Tạo mới Robot APK
 */
export const useCreateRobotApk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { robotApk: CreateRobotApkDto; file: File }) =>
      createRobotApk(params.robotApk, params.file),
    onSuccess: () => {
      toast.success("Tạo APK thành công!");
      // Làm mới toàn bộ danh sách APK (mọi trang/từ khóa)
      queryClient.invalidateQueries({ queryKey: ["robot-apks"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * 🟡 Cập nhật Robot APK
 */
export const useUpdateRobotApk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      apkId: string;
      robotApk: UpdateRobotApkDto;
      file?: File;
    }) => updateRobotApk(params.apkId, params.robotApk, params.file),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật APK thành công!");
      // Làm mới toàn bộ danh sách APK
      queryClient.invalidateQueries({ queryKey: ["robot-apks"] });
      // Invalidate mọi cache file-path của apkId này (bất kể accountId nào)
      queryClient.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "robot-apk-file-path" && q.queryKey[1] === variables.apkId,
      });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * 🔴 Xóa Robot APK theo ID
 */
export const useDeleteRobotApk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (apkId: string) => deleteRobotApk(apkId),
    onSuccess: () => {
      toast.success("Xóa APK thành công!");
      // Làm mới toàn bộ danh sách APK
      queryClient.invalidateQueries({ queryKey: ["robot-apks"] });
      // Xóa mọi cache file-path vì apk đã xóa
      queryClient.invalidateQueries({ queryKey: ["robot-apk-file-path"] });
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
