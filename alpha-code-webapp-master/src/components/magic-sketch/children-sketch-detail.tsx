"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock,
  Video, PlayCircle, ArrowLeft, Wand2, CheckCircle2, 
  RefreshCcw, X, Edit3, Loader2, AlertCircle, Play, Sparkles, Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoCapture } from "@/types/magic-sketch";
import { useGenerateVideo } from "@/features/magic-sketch/hooks/use-magic-sketch";

// --- 1. MODAL XÁC NHẬN (STYLE TRẺ EM) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2rem] shadow-[0_10px_0_0_rgba(0,0,0,0.1)] w-full max-w-sm p-8 border-4 border-amber-200 text-center">
        {/* Decor */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
           <AlertCircle className="w-10 h-10 text-amber-500" />
        </div>

        <h3 className="text-2xl font-black text-slate-700 mt-8 mb-2">Bé chưa viết gì cả?</h3>
        <p className="text-slate-500 font-medium mb-8">
          Nếu không viết gì, Robot sẽ tự nghĩ ra cách biến hình cho bé nhé?
        </p>

        <div className="flex flex-col gap-3">
           <button 
             onClick={() => { onConfirm(); onClose(); }}
             className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-[0_4px_0_0_#2563eb] active:shadow-none active:translate-y-1 transition-all"
           >
             Đồng ý luôn!
           </button>
           <button 
             onClick={onClose} 
             className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
           >
             Để bé viết lại
           </button>
        </div>
      </div>
    </div>
  );
};

interface SketchDetailViewProps {
  item: VideoCapture;
  onBack: () => void;
}

export const ChildrenSketchDetailView = ({ item, onBack }: SketchDetailViewProps) => {
  const [description, setDescription] = useState(item.description || "");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // State quản lý trạng thái UI
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Ref để điều khiển video
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

  const handlePlayVideo = () => {
    setIsPlaying(true);
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.error("Auto-play blocked:", err));
        }
    }, 0);
  };

  return (
    <>
      <ConfirmationModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleExecute} />

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* --- HEADER NAVIGATION --- */}
        <div className="flex items-center gap-4 mb-8">
          
          <div className="hidden sm:flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border-2 border-slate-100 text-slate-500 font-bold text-sm">
             <Clock className="w-4 h-4" /> 
             <span>Ngày tạo: {new Date(item.createdDate).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[700px]">
          
          {/* --- CỘT TRÁI: ẢNH GỐC (STYLE KHUNG TRANH) --- */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-white rounded-[2rem] p-4 border-4 border-white shadow-xl h-full flex flex-col transform rotate-1 hover:rotate-0 transition-transform duration-500 relative">
               {/* Tape effect */}
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/80 rotate-2 z-10 backdrop-blur-sm shadow-sm"></div>

               <div className="bg-blue-50 py-3 px-6 rounded-t-2xl font-black text-blue-600 flex items-center gap-2 text-lg border-b-2 border-blue-100">
                  <ImageIcon className="w-6 h-6" /> Tranh Của Bé
               </div>
               
               <div className="flex-1 bg-slate-50 rounded-b-2xl relative min-h-[300px] border-2 border-slate-100 overflow-hidden flex items-center justify-center p-6">
                 <img 
                    src={item.image} 
                    className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-500" 
                    alt="Input" 
                 />
               </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: VIDEO & CONTROLS (STYLE TV/MAGIC) --- */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-white rounded-[2.5rem] border-8 border-purple-100 shadow-2xl h-full flex flex-col overflow-hidden relative">
              
              {/* Header Title */}
              <div className="bg-white p-4 border-b-2 border-slate-100 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                   <div className={cn("p-2 rounded-xl text-white", item.isCreated ? "bg-purple-500" : "bg-blue-500")}>
                      {item.isCreated ? <Video className="w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
                   </div>
                   <span className="font-black text-xl text-slate-700">
                      {item.isCreated ? "Phép Thuật Hoàn Tất! ✨" : "Chuẩn Bị Biến Hình 🔮"}
                   </span>
                </div>
                {item.isCreated && (
                   <div className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full font-bold text-sm border-2 border-green-200 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Xong rồi nè
                   </div>
                )}
              </div>

              {/* === MAIN CONTENT AREA === */}
              <div className="flex-1 flex flex-col relative bg-slate-50">
                
                {/* 1. VIDEO PLAYER (TV SCREEN LOOK) */}
                {item.isCreated && !isPending && item.videoUrl && (
                  <div className={cn("flex-1 flex items-center justify-center overflow-hidden p-6 transition-all relative", isRegenerating ? "opacity-30 blur-sm" : "")}>
                     {/* Background Glow */}
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900"></div>
                     
                     {/* Video Container */}
                     <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <video 
                          ref={videoRef}
                          src={item.videoUrl} 
                          controls={isPlaying} 
                          loop 
                          className="w-auto h-auto max-w-full max-h-[450px] object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-slate-800 bg-black" 
                          onPause={() => setIsPlaying(false)}
                          onPlay={() => setIsPlaying(true)}
                        />
                     </div>

                     {/* BIG PLAY BUTTON OVERLAY */}
                     {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30 backdrop-blur-[2px]">
                            <button 
                                onClick={handlePlayVideo}
                                className="group relative w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(124,58,237,0.5)] hover:scale-110 hover:shadow-[0_15px_30px_rgba(124,58,237,0.7)] transition-all duration-300 border-4 border-white"
                            >
                                <Play className="w-10 h-10 text-white fill-current ml-1" />
                                <div className="absolute inset-0 rounded-full animate-ping bg-purple-400 opacity-30"></div>
                            </button>
                        </div>
                     )}
                  </div>
                )}

                {/* 2. FORM / LOADING / EMPTY STATE */}
                {(!item.isCreated || isRegenerating || isPending) && (
                  <div className={cn("absolute inset-0 z-10 flex flex-col transition-all bg-white", item.isCreated ? "top-1/3 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]" : "")}>
                    
                    {isPending ? (
                      // --- LOADING STATE ---
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-purple-50/50">
                        <div className="relative mb-6">
                           <div className="absolute inset-0 bg-purple-300 rounded-full animate-ping opacity-40"></div>
                           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-purple-200 shadow-xl">
                              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                           </div>
                        </div>
                        <h3 className="text-2xl font-black text-purple-700 mb-2">Đang biến hình...</h3>
                        <p className="text-slate-500 font-medium">
                          Robot đang phù phép cho tranh của bé.<br/>Đợi xíu xiu thôi nhé!
                        </p>
                      </div>
                    ) : (
                      // --- INPUT FORM ---
                      <div className={cn("flex-1 flex flex-col p-6 md:p-8", !item.isCreated && "items-center justify-center")}>
                        
                        {!item.isCreated && (
                          <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                               <Wand2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">Sẵn sàng biến hình chưa?</h3>
                            <p className="text-slate-500 mt-2 font-medium">Hãy nói cho Robot biết bé muốn tranh làm gì nhé!</p>
                          </div>
                        )}

                        {item.isCreated && (
                          <div className="flex justify-between items-center pb-4 mb-2">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                               <Edit3 className="w-5 h-5 text-blue-500"/> Sửa lại câu thần chú
                            </h3>
                            <button onClick={() => setIsRegenerating(false)} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-1">
                               <X className="w-4 h-4"/> Hủy
                            </button>
                          </div>
                        )}

                        {/* Text Area */}
                        <div className="w-full space-y-3 mb-6">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Câu thần chú (Mô tả):</label>
                          <textarea 
                            placeholder="Ví dụ: Con cá đang bơi dưới biển, con chim đang bay..." 
                            className="w-full min-h-[120px] p-5 bg-slate-50 border-4 border-slate-100 rounded-3xl text-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all resize-none font-medium"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                          />
                        </div>
                        
                        {/* Big Action Button */}
                        <button 
                          className={cn(
                             "w-full py-4 rounded-2xl font-black text-xl text-white shadow-[0_8px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-2 transition-all flex items-center justify-center gap-3",
                             item.isCreated 
                                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-700"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 shadow-blue-800"
                          )}
                          onClick={handlePreSubmit}
                        >
                          {item.isCreated ? (
                             <><RefreshCcw className="w-6 h-6 stroke-[3px]"/> Thử Phép Thuật Khác</>
                          ) : (
                             <><Sparkles className="w-6 h-6 stroke-[3px] animate-pulse"/> Úm Ba La - Biến Hình!</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 3. STATIC FOOTER INFO (Khi đang xem video) */}
                {item.isCreated && !isRegenerating && !isPending && (
                   <div className="bg-white p-5 border-t-2 border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex-1 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Câu thần chú đã dùng:</span>
                        <p className="text-slate-700 font-bold truncate">
                           {description || "Bé để Robot tự nghĩ"}
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsRegenerating(true)} 
                        className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                      >
                        <RefreshCcw className="w-5 h-5" /> Làm lại
                      </button>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};