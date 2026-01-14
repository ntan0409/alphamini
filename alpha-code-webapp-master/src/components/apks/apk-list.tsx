"use client";

import { useEffect, useState, useMemo } from "react";
import { Download, Calendar, Package, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { usePagedRobotApks, useFilePath } from "@/features/apks/hooks/use-robot-apk";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import type { RobotApk } from "@/types/robot-apk";
import LoadingState from "../loading-state";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ViewApkModal } from "./view-apk-modal";

interface ApkListProps {
  page?: number;
  size?: number;
  search?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  onPageChange?: (page: number) => void;
}

export default function ApkList({ 
  page = 1, 
  size = 12, 
  search = "",
  selectedModel = "all",
  onModelChange,
  onPageChange
}: ApkListProps) {
  const [accountId, setAccountId] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      const userInfo = getUserInfoFromToken(accessToken);
      setAccountId(userInfo?.id || null);
    }
  }, []);

  const { data, isLoading, error } = usePagedRobotApks(page, size, search);

  // Filter: chỉ hiển thị APK có status = 1 (active) và filter theo model
  const filteredList = useMemo(() => {
    if (!data?.data) return [];
    let filtered = data.data.filter(apk => apk.status === 1); // Chỉ hiển thị active
    
    if (selectedModel !== "all") {
      filtered = filtered.filter(apk => apk.robotModelId === selectedModel);
    }
    
    return filtered;
  }, [data?.data, selectedModel]);

  // Get unique models for filter dropdown
  const availableModels = useMemo(() => {
    if (!data?.data) return [];
    const models = new Map<string, string>();
    data.data
      .filter(apk => apk.status === 1)
      .forEach(apk => {
        if (apk.robotModelId && apk.robotModelName) {
          models.set(apk.robotModelId, apk.robotModelName);
        }
      });
    return Array.from(models.entries()).map(([id, name]) => ({ id, name }));
  }, [data?.data]);

  const totalPages = data?.total_pages || 0;
  const totalCount = data?.total_count || 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center min-h-[400px]">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Lỗi khi tải danh sách APK</p>
            <p className="text-sm text-red-600 mt-1">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border rounded-lg text-center shadow-sm">
        <Image
          src="/collect.png"
          alt="Chưa có APK nào được phát hành"
          width={200}
          height={200}
          className="mb-6 opacity-90"
          priority={false}
        />
        <div className="text-xl font-semibold text-gray-800">Chưa có APK nào được phát hành</div>
        <div className="text-sm text-gray-500 mt-2 max-w-md">
          {search || selectedModel !== "all"
            ? "Không tìm thấy APK phù hợp với bộ lọc của bạn."
            : "Vui lòng quay lại sau khi quản trị viên tải lên phiên bản mới cho robot của bạn."}
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition">
            Về trang chủ
          </Link>
          <Link href="/resources" className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50 transition">
            Xem tài nguyên khác
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Update model filter in parent */}
      {onModelChange && (
        <div className="mb-4">
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Lọc theo model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả model ({availableModels.length})</SelectItem>
              {availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {filteredList.length} {filteredList.length === 1 ? "APK" : "APK"}
      </div>

      {/* APK Grid */}
      <ApkGrid 
        apks={filteredList} 
        accountId={accountId ?? undefined}
      />

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Trang {page} / {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Sau
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function ApkGrid({ apks, accountId }: { apks: RobotApk[]; accountId?: string }) {
  const [selectedApk, setSelectedApk] = useState<RobotApk | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (apk: RobotApk) => {
    setSelectedApk(apk);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {apks.map((a) => (
          <ApkItem 
            key={a.id} 
            apk={a} 
            accountId={accountId}
            onViewDetail={() => handleViewDetail(a)}
          />
        ))}
      </div>

      <ViewApkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApk(null);
        }}
        apk={selectedApk}
        accountId={accountId}
      />
    </>
  );
}

function ApkItem({ 
  apk, 
  accountId,
  onViewDetail
}: { 
  apk: RobotApk; 
  accountId?: string;
  onViewDetail: () => void;
}) {
  const { data: filePath, isLoading: fileLoading } = useFilePath(apk.id, accountId, apk.isRequireLicense);

  const createdDate = apk.createdDate ? new Date(apk.createdDate) : null;

  const handleDownload = () => {
    if (filePath) {
      // Tạo link ẩn với download attribute để force download file ZIP trực tiếp
      const link = document.createElement('a');
      link.href = filePath;
      link.download = `${apk.name || apk.robotModelName || 'robot'}-v${apk.version}.zip`;
      // Không dùng target='_blank' để tránh mở tab mới, download trực tiếp
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-rose-600" />
              <Badge variant="secondary" className="text-xs">
                {apk.robotModelName || "Unknown Model"}
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{apk.name || `Phiên bản ${apk.version}`}</h3>
            {apk.name && <p className="text-sm text-gray-600 mt-1">v{apk.version}</p>}
          </div>
        </div>

        {/* Description */}
        {apk.description && (
          <div
            className="text-sm text-gray-600 mt-2 prose prose-sm max-w-none line-clamp-3"
            dangerouslySetInnerHTML={{ __html: String(apk.description) }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-5 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          {createdDate && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{createdDate.toLocaleDateString("vi-VN")}</span>
            </div>
          )}
          {apk.isRequireLicense && (
            <Badge variant="outline" className="text-xs">
              Yêu cầu License
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onViewDetail}
          >
            Chi tiết
          </Button>
          {fileLoading ? (
            <Button
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
              disabled
            >
              <Download className="w-4 h-4 mr-2" />
              ...
            </Button>
          ) : filePath ? (
            <Button
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
          ) : apk.isRequireLicense ? (
            <Link href="/license-key" className="flex-1">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                <Package className="w-4 h-4 mr-2" />
                Mua license
              </Button>
            </Link>
          ) : (
            <Button
              className="flex-1 bg-gray-400 text-white cursor-not-allowed"
              disabled
            >
              <Download className="w-4 h-4 mr-2" />
              Không khả dụng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
