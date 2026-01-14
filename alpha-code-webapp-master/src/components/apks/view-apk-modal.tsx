"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RobotApk } from "@/types/robot-apk";
import { Download, Package, Calendar, Info, Key, FileText } from "lucide-react";
import { useFilePath } from "@/features/apks/hooks/use-robot-apk";
import Link from "next/link";

interface ViewApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  apk: RobotApk | null;
  accountId?: string;
}

export function ViewApkModal({ isOpen, onClose, apk, accountId }: ViewApkModalProps) {
  const { data: filePath, isLoading: fileLoading } = useFilePath(apk?.id, accountId, apk?.isRequireLicense);

  if (!apk) return null;

  const handleDownload = () => {
    if (filePath) {
      // Tạo link ẩn với download attribute để force download file ZIP trực tiếp
      const link = document.createElement('a');
      link.href = filePath;
      link.download = `apk-${apk.robotModelName || 'robot'}-v${apk.version}.zip`;
      // Không dùng target='_blank' để tránh mở tab mới, download trực tiếp
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const createdDate = apk.createdDate ? new Date(apk.createdDate) : null;
  const lastUpdated = apk.lastUpdated ? new Date(apk.lastUpdated) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-600" />
            {apk.name || "Chi tiết APK"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Model và Version */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-sm">
                    {apk.robotModelName || "Unknown Model"}
                  </Badge>
                  {apk.isRequireLicense && (
                    <Badge variant="outline" className="text-sm flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      Yêu cầu License
                    </Badge>            
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{apk.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Phiên bản {apk.version}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {apk.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4" />
                Mô tả
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200"
                dangerouslySetInnerHTML={{ __html: String(apk.description) }}
              />
            </div>
          )}

          {/* Thông tin chi tiết */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Info className="w-4 h-4" />
              Thông tin
            </div>
            <div className="grid gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Model Robot:</span>
                <span className="text-sm font-medium text-gray-900">{apk.robotModelName || "Không xác định"}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phiên bản:</span>
                <span className="text-sm font-medium text-gray-900">v{apk.version}</span>
              </div>

              {createdDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Ngày tạo:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {createdDate.toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              )}

              {lastUpdated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {lastUpdated.toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Yêu cầu License:</span>
                <Badge variant={apk.isRequireLicense ? "default" : "secondary"}>
                  {apk.isRequireLicense ? "Có" : "Không"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <Badge variant={apk.status === 1 ? "default" : "secondary"}>
                  {apk.status === 1 ? "Đang hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {fileLoading ? (
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled
            >
              <Download className="w-4 h-4 mr-2" />
              Đang chuẩn bị...
            </Button>
          ) : filePath ? (
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống APK
            </Button>
          ) : apk.isRequireLicense ? (
            <Link href="/license-key">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Package className="w-4 h-4 mr-2" />
                Mua license
              </Button>
            </Link>
          ) : (
            <Button
              className="bg-gray-400 text-white cursor-not-allowed"
              disabled
            >
              <Download className="w-4 h-4 mr-2" />
              Không khả dụng
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

