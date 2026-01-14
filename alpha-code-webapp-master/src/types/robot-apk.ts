
export interface RobotApk {
  id: string;
  name: string;
  version: string;
  description: string;
  robotModelId: string;
  robotModelName: string; // backend should include this
  isRequireLicense: boolean
  createdDate: string;
  status: number;
  lastUpdated?: string;
}

/**
 * DTO cho tạo mới Robot APK (POST)
 */
export interface CreateRobotApkDto {
  name: string;
  version: string;
  description: string;
  robotModelId: string;
  isRequireLicense: boolean;
  file: File;
}

/**
 * DTO cho cập nhật Robot APK (PUT)
 */
export interface UpdateRobotApkDto {
  name?: string;
  version?: string;
  description?: string;
  robotModelId?: string;
  isRequireLicense?: boolean;
  status?: number;
  file?: File;
}