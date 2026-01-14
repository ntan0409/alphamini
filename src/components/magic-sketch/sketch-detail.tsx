"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageIcon, Video, PlayCircle, Clock, ArrowLeft,
  Wand2, CheckCircle2, RefreshCcw, X, Edit3, Loader2, AlertCircle, Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoCapture } from "@/types/magic-sketch";
import { useGenerateVideo } from "@/features/magic-sketch/hooks/use-magic-sketch";

// Modal Xác Nhận (Giữ nguyên)
const ConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bạn chưa nhập mô tả?</h3>
          <p className="text-gray-500 text-sm mb-6">Nếu để trống, AI sẽ tự do sáng tạo video. Bạn có muốn tiếp tục?</p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">Quay lại</Button>
            <Button onClick={() => { onConfirm(); onClose(); }} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">Tiếp tục</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SketchDetailViewProps {
  item: VideoCapture;
  onBack: () => void;
}

export const SketchDetailView = ({ item, onBack }: SketchDetailViewProps) => {
  const [description, setDescription] = useState(item.description || "");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // State quản lý trạng thái UI
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 1. Tạo Ref để điều khiển video trực tiếp
  const videoRef = useRef<HTMLVideoElement>(null);

  const { mutate: generate, isPending } = useGenerateVideo();

  // Reset state khi item thay đổi
  useEffect(() => {
    setDescription(item.description || "");
    setIsRegenerating(false);
    setIsPlaying(false);
  }, [item]);

  const handleExecute = () => {
    generate({ id: item.id, description: description });
    setIsRegenerating(false);
    setIsPlaying(false);
  };

  const handlePreSubmit = () => {
    if (!description.trim()) setShowModal(true);
    else handleExecute();
  };

  // 2. Hàm xử lý Play Video (Fix lỗi bấm 2 lần)
  const handlePlayVideo = () => {
    setIsPlaying(true); // Cập nhật UI để hiện controls
    
    // Đợi 1 chút để React render xong controls rồi mới gọi play
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.error("Auto-play blocked:", err));
        }
    }, 0);
  };

  return (
    <>
      <ConfirmationModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleExecute} />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100 pl-0">
            <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <span className="text-gray-500 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> {new Date(item.createdDate).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[650px]">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Card className="h-full border-blue-100 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-50 p-3 border-b font-medium text-gray-700 flex items-center gap-2 text-sm">
                <ImageIcon className="w-4 h-4 text-blue-600" /> Ảnh gốc (Input)
              </div>
              <div className="flex-1 bg-gray-100 relative min-h-[300px]">
                <img src={item.image} className="w-full h-full object-contain p-4" alt="Input" />
              </div>
            </Card>
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-8">
            <Card className="h-full border-blue-100 shadow-md flex flex-col overflow-hidden">
              <div className="bg-white p-3 border-b font-medium text-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.isCreated ? <><Video className="w-5 h-5 text-purple-600" /> Kết quả AI</> : <><Wand2 className="w-5 h-5 text-blue-600" /> Thiết lập tạo Video</>}
                </div>
                {item.isCreated && <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" /> Hoàn thành</Badge>}
              </div>

              <div className="flex-1 flex flex-col relative bg-gray-900">
                
                {/* VIDEO PLAYER AREA */}
                {item.isCreated && !isPending && item.videoUrl && (
                  <div className={cn("flex-1 flex items-center justify-center overflow-hidden p-6 transition-all bg-gray-900 relative group", isRegenerating ? "opacity-30 blur-sm" : "")}>
                    
                    {/* 3. Gắn ref vào video và bỏ autoPlay tự động của React */}
                    <video 
                      ref={videoRef}
                      src={item.videoUrl} 
                      controls={isPlaying} 
                      loop 
                      className="w-auto h-auto max-w-full max-h-[450px] object-contain rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                      // Khi video bị pause thủ công, ta có thể hiện lại nút Play lớn nếu muốn
                      onPause={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                    />

                    {/* NÚT PLAY LỚN */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-[1px]">
                            <button 
                                onClick={handlePlayVideo} // Gọi hàm xử lý mới
                                className="transform transition-all duration-300 hover:scale-110 group-hover:bg-blue-600/90 bg-blue-600 text-white rounded-full p-6 shadow-2xl border-4 border-white/20"
                            >
                                <Play className="w-12 h-12 fill-current pl-1" />
                            </button>
                        </div>
                    )}
                  </div>
                )}

                {/* FORM INPUT AREA (Giữ nguyên) */}
                {(!item.isCreated || isRegenerating || isPending) && (
                  <div className={cn("bg-white flex flex-col gap-4 absolute inset-x-0 bottom-0 z-10 transition-all", item.isCreated ? "h-2/3 rounded-t-2xl shadow-2xl p-6" : "h-full justify-center items-center p-6")}>
                    {isPending ? (
                      <div className="text-center py-10">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900">Đang tạo video...</h3>
                        <p className="text-sm text-gray-500 mt-2">AI đang xử lý yêu cầu của bạn (Có thể mất 30-60s).</p>
                      </div>
                    ) : (
                      <div className={cn("w-full flex flex-col gap-4", !item.isCreated && "max-w-lg text-center")}>
                        {!item.isCreated && (
                          <div className="mb-4">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Wand2 className="w-8 h-8" /></div>
                            <h3 className="text-xl font-bold text-gray-900">Sẵn sàng tạo Video!</h3>
                          </div>
                        )}
                        {item.isCreated && (
                          <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Edit3 className="w-4 h-4 text-blue-600"/> Chỉnh sửa mô tả & Tạo lại</h3>
                            <Button variant="ghost" size="sm" onClick={() => setIsRegenerating(false)} className="text-red-500 hover:bg-red-50"><X className="w-4 h-4 mr-1"/> Hủy</Button>
                          </div>
                        )}
                        <div className="space-y-2 text-left">
                          <label className="text-sm font-medium text-gray-700">Mô tả ý tưởng (Description):</label>
                          <Textarea placeholder="Ví dụ: Làm cho nhân vật vẫy tay..." className="min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePreSubmit}>
                          {item.isCreated ? <><RefreshCcw className="mr-2 h-4 w-4"/> Tạo lại Video</> : <><PlayCircle className="mr-2 h-4 w-4"/> Bắt đầu tạo Video</>}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Footer (Giữ nguyên) */}
                {item.isCreated && !isRegenerating && !isPending && (
                   <div className="bg-white p-4 border-t flex items-center justify-between">
                      <div className="text-sm text-gray-600 max-w-[70%] truncate">
                        <span className="font-bold mr-2">Prompt:</span> {description || "Không có mô tả"}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setIsRegenerating(true)} className="text-blue-600 border-blue-200">
                        <RefreshCcw className="w-3 h-3 mr-2" /> Tạo lại
                      </Button>
                   </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};