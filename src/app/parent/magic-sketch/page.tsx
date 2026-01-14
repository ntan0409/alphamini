"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  PlayCircle, Clock, Wand2, Search, Loader2, Plus, 
  Image as ImageIcon, Trash2, ChevronLeft, ChevronRight, AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { 
  useGetSketchList, 
  useUploadCapture, 
  useDeleteCapture 
} from "@/features/magic-sketch/hooks/use-magic-sketch";
import { SketchDetailView } from "@/components/magic-sketch/sketch-detail";
import ProtectAddon from "@/components/protect-addon";

const MAGIC_SKETCH_CATEGORY_ID = 5;

// --- MODAL XÓA (Giữ nguyên) ---
interface DeleteAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}
const DeleteAlertModal = ({ isOpen, onClose, onConfirm, isDeleting }: DeleteAlertModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isDeleting ? undefined : onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa vĩnh viễn?</h3>
          <p className="text-gray-500 text-sm mb-6">Hành động này không thể hoàn tác. Ảnh gốc và video đã tạo sẽ bị xóa.</p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} disabled={isDeleting} className="flex-1">Hủy bỏ</Button>
            <Button onClick={onConfirm} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Xóa ngay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CONTENT CHÍNH ---
const MagicSketchContent = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  
  // STATE PAGING
  const [page, setPage] = useState(1);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        const user = getUserInfoFromToken(token);
        setAccountId(user?.id || null);
      }
    }
  }, []);

  const { mutate: upload, isPending: isUploading } = useUploadCapture();
  const { mutate: deleteCapture, isPending: isDeleting } = useDeleteCapture();
  
  // Gọi Hook với page hiện tại
  const { data: response, isLoading, error } = useGetSketchList(accountId, page);
  
  const items = response?.data || [];
  const totalPages = response?.total_pages || 1;

  // Filter local (Chỉ filter trên trang hiện tại - Đây là hạn chế của client-side search với server-side paging)
  const filteredItems = items.filter((item) =>
    (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find((i) => i.id === selectedId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && accountId) {
      upload({ file: e.target.files[0], accountId: accountId, description: "Uploaded from web app" });
      e.target.value = "";
      setPage(1); // Reset về trang 1 khi upload
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteCapture(deleteId, {
        onSuccess: () => setDeleteId(null)
      });
    }
  };

  if (isLoading) return <div className="flex h-[80vh] justify-center items-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600"/></div>;
  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu. <Button onClick={() => window.location.reload()} variant="link">Thử lại</Button></div>;

  return (
    <div className="p-6 md:p-8 min-h-screen bg-gray-50/50">
      <DeleteAlertModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDeleteConfirm} isDeleting={isDeleting} />

      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
             <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600 shadow-sm"><Wand2 size={28} /></div>
             Phép thuật tranh vẽ
           </h1>
           <p className="text-gray-500 mt-2 md:ml-[60px]">Biến những bức tranh vẽ tay thành video hoạt hình sống động với AI.</p>
        </div>
        {/* <div className="hidden md:block">
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
           <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-blue-600 text-white shadow-md">
              {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4"/>} Chụp ảnh mới
           </Button>
        </div> */}
      </div>

      {selectedId && selectedItem ? (
        <SketchDetailView item={selectedItem} onBack={() => setSelectedId(null)} />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Tìm kiếm..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="md:hidden w-full">
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-blue-600">Chụp ảnh mới</Button>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="relative group h-full">
                    <Card onClick={() => setSelectedId(item.id)} className={cn("h-full overflow-hidden border-2 hover:shadow-xl transition-all cursor-pointer flex flex-col", item.isCreated ? "border-transparent" : "border-dashed border-blue-300")}>
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden border-b">
                        <img src={item.image} alt="Thumb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {item.isCreated ? <PlayCircle className="text-white w-12 h-12" /> : <Wand2 className="text-white w-12 h-12" />}
                        </div>
                        <div className="absolute top-2 right-2">
                           {item.isCreated ? <Badge className="bg-green-500">Video sẵn sàng</Badge> : <Badge variant="secondary">Mới chụp</Badge>}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center text-xs text-gray-400 mb-2"><Clock size={10} className="mr-1"/> {new Date(item.createdDate).toLocaleDateString("vi-VN")}</div>
                        <h3 className="font-medium text-sm line-clamp-2 flex-1 text-gray-700">{item.description || "Chưa có mô tả"}</h3>
                        {!item.isCreated && <div className="pt-2 mt-auto border-t border-dashed"><p className="text-xs font-semibold text-blue-600 flex items-center gap-1">Tạo ngay <Wand2 size={12}/></p></div>}
                      </CardContent>
                    </Card>
                    <Button variant="destructive" size="icon" className="absolute top-2 left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md" onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>

              {/* --- THANH PHÂN TRANG (PAGING) --- */}
              {/* Chỉ hiện khi có nhiều hơn 1 trang hoặc đang ở trang > 1 */}
              {(totalPages > 1 || page > 1) && (
                <div className="flex justify-center items-center gap-4 py-8">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-24"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                  </Button>
                  
                  <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-md border shadow-sm">
                    Trang {page} / {totalPages}
                  </span>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="w-24"
                  >
                    Sau <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-300">
               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4"><ImageIcon className="w-8 h-8 text-blue-300" /></div>
               <h3 className="text-lg font-medium text-gray-900">Không tìm thấy dữ liệu</h3>
               {page > 1 && <Button onClick={() => setPage(1)} variant="link" className="mt-2">Quay lại trang đầu</Button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MagicSketchPage() {
  return (
    <ProtectAddon category={MAGIC_SKETCH_CATEGORY_ID}>
      <MagicSketchContent />
    </ProtectAddon>
  );
}