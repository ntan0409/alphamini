import { PagedResult } from "@/types/page-result";
import { CreateRobotApkDto, RobotApk, UpdateRobotApkDto } from "@/types/robot-apk";
import { robotsHttp } from "@/utils/http";

export const getPagedRobotApks = async (
    page: number,
    size: number,
    search?: string,
    signal?: AbortSignal,
) => {
    try {
        const response = await robotsHttp.get<PagedResult<RobotApk>>("/robot-apks", {
            params: {
                page,
                size,
                search,
            },
            signal,
        });

        return response.data;
    } catch (error) {
        console.error("API Error in getPagedActions:", error);
        throw error;
    }
};

export const getFilePath = async (apkId: string, accountId?: string): Promise<string> => {
    try {
        const response = await robotsHttp.get<string>('/robot-apks/file-path', {
            params: {
                apkId,
                ...(accountId && { accountId }) // Chỉ gửi accountId nếu có
            }
        });
        return response.data;
    }
    catch (error) {
        console.error("API Error in getFilePath:", error);
        throw error;
    }
}

/**
 * 1. Tạo mới Robot APK (upload file)
 */
export const createRobotApk = async (robotApk: CreateRobotApkDto, file: File): Promise<RobotApk> => {
  try {
    const formData = new FormData();
    // Loại bỏ field 'file' khỏi DTO vì file được gửi riêng
    const { file: _, ...dtoWithoutFile } = robotApk;
    // Gửi JSON như một Blob với Content-Type application/json để @RequestPart nhận đúng
    const robotApkBlob = new Blob([JSON.stringify(dtoWithoutFile)], { type: "application/json" });
    formData.append("robotApk", robotApkBlob);
    formData.append("file", file);

    const response = await robotsHttp.post<RobotApk>("/robot-apks", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("API Error in createRobotApk:", error);
    throw error;
  }
};

/**
 *  2a. Cập nhật file APK (PUT /{apkId}/file)
 */
export const updateRobotApkFile = async (apkId: string, file: File): Promise<RobotApk> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await robotsHttp.put<RobotApk>(`/robot-apks/${apkId}/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("API Error in updateRobotApkFile:", error);
    throw error;
  }
};

/**
 *  2b. Cập nhật metadata Robot APK (PUT /{id})
 */
export const updateRobotApkMetadata = async (apkId: string, robotApk: UpdateRobotApkDto): Promise<RobotApk> => {
  try {
    // Loại bỏ field 'file' khỏi DTO vì đây là endpoint cập nhật metadata
    const { file: _, ...dtoWithoutFile } = robotApk;
    
    const response = await robotsHttp.put<RobotApk>(`/robot-apks/${apkId}`, dtoWithoutFile);
    return response.data;
  } catch (error) {
    console.error("API Error in updateRobotApkMetadata:", error);
    throw error;
  }
};

/**
 *  2. Cập nhật Robot APK (có thể cập nhật cả file và metadata)
 */
export const updateRobotApk = async (apkId: string, robotApk: UpdateRobotApkDto, file?: File): Promise<RobotApk> => {
  try {
    const { file: _, ...dtoWithoutFile } = robotApk;
    const hasMetadata = Object.keys(dtoWithoutFile).length > 0;
    
    // Nếu có cả file và metadata, cập nhật file trước rồi metadata sau
    if (file && hasMetadata) {
      await updateRobotApkFile(apkId, file);
      return await updateRobotApkMetadata(apkId, robotApk);
    }
    
    // Chỉ cập nhật file
    if (file) {
      return await updateRobotApkFile(apkId, file);
    }
    
    // Chỉ cập nhật metadata
    if (hasMetadata) {
      return await updateRobotApkMetadata(apkId, robotApk);
    }
    
    // Nếu không có gì để cập nhật
    throw new Error("Không có dữ liệu để cập nhật");
  } catch (error) {
    console.error("API Error in updateRobotApk:", error);
    throw error;
  }
};

/**
 * 3. Xóa Robot APK theo ID
 */
export const deleteRobotApk = async (apkId: string): Promise<void> => {
  try {
    await robotsHttp.delete(`/robot-apks/${apkId}`);
  } catch (error) {
    console.error("API Error in deleteRobotApk:", error);
    throw error;
  }
};