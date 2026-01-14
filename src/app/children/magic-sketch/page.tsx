"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlayCircle, Clock, Wand2, Search, Loader2, Plus, 
  Image as ImageIcon, Trash2, ChevronLeft, ChevronRight, Star, Heart, Cloud
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserInfoFromToken } from "@/utils/tokenUtils";
import { 
  useGetSketchList, 
  useUploadCapture, 
  useDeleteCapture 
} from "@/features/magic-sketch/hooks/use-magic-sketch";
import { ChildrenSketchDetailView } from "@/components/magic-sketch/children-sketch-detail"; // Lưu ý: Nếu muốn Detail cũng style trẻ em, cần sửa cả component này.
import ProtectAddon from "@/components/protect-addon";

const MAGIC_SKETCH_CATEGORY_ID = 5;

// --- 1. MODAL XÓA (STYLE TRẺ EM) ---
interface DeleteAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}
const DeleteAlertModal = ({ isOpen, onClose, onConfirm, isDeleting }: DeleteAlertModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in zoom-in-90 duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={isDeleting ? undefined : onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-[2rem] shadow-[0_10px_0_0_rgba(0,0,0,0.1)] w-full max-w-sm p-8 border-4 border-red-200 text-center overflow-hidden">
         {/* Decoration */}
         <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full blur-xl opacity-50"></div>

         <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-white shadow-sm">
            <Trash2 className="w-10 h-10" />
         </div>
         
         <h3 className="text-2xl font-black text-slate-700 mb-2">Xóa tranh ư?</h3>
         <p className="text-slate-500 text-base mb-8 font-medium">
           Tranh và video sẽ biến mất mãi mãi đó bé ơi! <br/> Bé có chắc không?
         </p>
         
         <div className="flex flex-col gap-3">
            <button 
              onClick={onConfirm} 
              disabled={isDeleting} 
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-[0_4px_0_0_#991b1b] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : "Vâng, xóa đi ạ"}
            </button>
            <button 
              onClick={onClose} 
              disabled={isDeleting}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
            >
              Không, giữ lại
            </button>
         </div>
      </div>
    </div>
  );
};

// --- 2. MAIN CONTENT (STYLE TRẺ EM) ---
const MagicSketchContent = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
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
  const { data: response, isLoading, error } = useGetSketchList(accountId, page);
  
  const items = response?.data || [];
  const totalPages = response?.total_pages || 1;

  const filteredItems = items.filter((item) =>
    (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedItem = items.find((i) => i.id === selectedId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && accountId) {
      upload({ file: e.target.files[0], accountId: accountId, description: "Bé vẽ tranh" });
      e.target.value = "";
      setPage(1);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteCapture(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  // --- UI LOADING TRẺ EM ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E0F7FA] flex flex-col justify-center items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-blue-400 shadow-[0_8px_0_0_#60A5FA]">
             <Wand2 className="w-12 h-12 text-blue-500 animate-bounce" />
          </div>
        </div>
        <p className="text-xl font-bold text-blue-600 animate-pulse">Đang mở hộp màu...</p>
      </div>
    );
  }

  // --- UI ERROR TRẺ EM ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF4E0] flex flex-col justify-center items-center gap-4 text-center p-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-300">
             <Cloud className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-2xl font-black text-orange-600">Ôi hỏng rồi!</h3>
        <p className="text-orange-800 font-medium">Không lấy được tranh của bé rồi. Thử lại nhé?</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-[0_6px_0_0_#C2410C] active:shadow-none active:translate-y-1">
          Thử lại ngay
        </button>
      </div>
    );
  }

  return (
    // BG: Xanh nhạt vân mây (giả lập)
    <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 font-sans selection:bg-purple-200">
      
      <DeleteAlertModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDeleteConfirm} isDeleting={isDeleting} />

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative">
           {/* Decor icons */}
           <Star className="absolute -top-6 -left-6 text-yellow-400 w-10 h-10 fill-current animate-spin-slow" />
           <Cloud className="absolute -top-8 left-20 text-white w-16 h-16 fill-current drop-shadow-sm opacity-80" />
           
           <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm flex items-center gap-3">
             Phép Thuật Tranh Vẽ <Wand2 className="text-purple-500 w-10 h-10 animate-pulse" />
           </h1>
           <p className="text-slate-500 font-bold text-lg mt-2 ml-2 bg-white/60 inline-block px-4 py-1 rounded-full border border-white backdrop-blur-sm">
             Biến tranh vẽ thành hoạt hình vui nhộn!
           </p>
        </div>
        
        {/* NÚT UPLOAD TO ĐÙNG */}
        {/* <div className="hidden md:block z-10">
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
           <button 
             onClick={() => fileInputRef.current?.click()} 
             disabled={isUploading} 
             className="group relative px-8 py-4 bg-gradient-to-b from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 text-white font-black text-xl rounded-3xl shadow-[0_8px_0_0_#15803d] active:shadow-none active:translate-y-2 transition-all flex items-center gap-3 border-2 border-green-600"
           >
              {isUploading ? <Loader2 className="animate-spin w-8 h-8"/> : <Plus className="w-8 h-8 stroke-[3px] group-hover:rotate-90 transition-transform"/>}
              <span>Vẽ Tranh Mới</span>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-yellow-900 font-bold px-2 py-1 rounded-full border-2 border-yellow-600 transform rotate-12">
                 Thử ngay!
              </div>
           </button>
        </div> */}
      </div>

      {selectedId && selectedItem ? (
        // --- DETAIL VIEW (Tạm thời giữ logic cũ, bọc trong container đẹp) ---
        <div className="bg-white rounded-[2.5rem] p-6 border-8 border-purple-100 shadow-xl max-w-7xl mx-auto relative">
           <button onClick={() => setSelectedId(null)} className="absolute -top-4 -left-4 bg-red-500 text-white p-3 rounded-full shadow-[0_4px_0_0_#991b1b] border-2 border-white hover:scale-110 transition-transform z-20">
              <ChevronLeft className="w-8 h-8" />
           </button>
           <ChildrenSketchDetailView item={selectedItem} onBack={() => setSelectedId(null)} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* SEARCH & MOBILE UPLOAD */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white/70 p-4 rounded-3xl border-2 border-blue-100 backdrop-blur-sm">
            <div className="relative w-full sm:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
              <input 
                placeholder="Tìm tranh của bé..." 
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-blue-100 rounded-2xl text-blue-900 placeholder:text-blue-300 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-lg" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            {/* <div className="md:hidden w-full">
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full py-4 bg-green-500 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_0_#15803d] active:shadow-none active:translate-y-1">
                 + Vẽ Tranh Mới
               </button>
            </div> */}
          </div>

          {filteredItems.length > 0 ? (
            <>
              {/* --- GRID GALLERY STYLE HOẠT HÌNH --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="relative group perspective">
                    
                    {/* CARD CONTAINER */}
                    <div 
                       onClick={() => setSelectedId(item.id)}
                       className={cn(
                         "relative bg-white rounded-[2rem] p-3 border-4 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:rotate-1 shadow-[0_10px_0_0_rgba(0,0,0,0.1)]",
                         item.isCreated ? "border-purple-400 hover:shadow-[0_10px_0_0_#c084fc]" : "border-slate-200 hover:border-blue-400 hover:shadow-[0_10px_0_0_#60a5fa]"
                       )}
                    >
                      {/* 1. IMAGE AREA */}
                      <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden border-2 border-slate-100 relative">
                        <img 
                          src={item.image} 
                          alt="Tranh vẽ" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        
                        {/* Overlay Icon */}
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className={cn("p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300", item.isCreated ? "bg-purple-500 text-white" : "bg-blue-500 text-white")}>
                              {item.isCreated ? <PlayCircle className="w-10 h-10 fill-current" /> : <Wand2 className="w-10 h-10" />}
                           </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-2 right-2">
                           {item.isCreated ? (
                              <span className="bg-green-400 text-white font-bold text-xs px-2 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                                <PlayCircle size={12} fill="currentColor"/> Xem ngay
                              </span>
                           ) : (
                              <span className="bg-yellow-400 text-yellow-900 font-bold text-xs px-2 py-1 rounded-full border-2 border-white shadow-sm">
                                Mới toanh
                              </span>
                           )}
                        </div>
                      </div>

                      {/* 2. TEXT CONTENT */}
                      <div className="mt-3 px-1 pb-1">
                         <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
                            <Clock size={12}/> <span>{new Date(item.createdDate).toLocaleDateString("vi-VN")}</span>
                         </div>
                         <h3 className={cn("font-bold text-base line-clamp-2 min-h-[3rem]", item.description ? "text-slate-700" : "text-slate-400 italic")}>
                           {item.description || "Chưa có tên tranh..."}
                         </h3>
                         
                         {!item.isCreated && (
                           <div className="mt-2 bg-blue-50 text-blue-600 text-center py-2 rounded-xl font-bold text-sm border-2 border-blue-100 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-colors">
                             ✨ Biến hình ngay
                           </div>
                         )}
                      </div>
                    </div>

                    {/* DELETE BUTTON (Floating Bubble) */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      className="absolute -top-3 -left-3 w-10 h-10 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-md transform scale-0 group-hover:scale-100 transition-transform duration-200 z-10"
                      title="Xóa tranh này"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                ))}
              </div>

              {/* --- PAGING STYLE TRẺ EM --- */}
              {(totalPages > 1 || page > 1) && (
                <div className="flex justify-center items-center gap-4 py-10">
                   <button 
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page === 1}
                     className="w-14 h-14 rounded-full bg-white border-4 border-blue-200 text-blue-500 flex items-center justify-center shadow-[0_4px_0_0_#bfdbfe] active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_#bfdbfe]"
                   >
                     <ChevronLeft size={32} strokeWidth={3} />
                   </button>
                   
                   <div className="bg-white px-6 py-3 rounded-2xl border-4 border-blue-200 text-blue-600 font-black text-xl shadow-sm">
                      {page} / {totalPages}
                   </div>
                   
                   <button 
                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                     disabled={page >= totalPages}
                     className="w-14 h-14 rounded-full bg-white border-4 border-blue-200 text-blue-500 flex items-center justify-center shadow-[0_4px_0_0_#bfdbfe] active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_#bfdbfe]"
                   >
                     <ChevronRight size={32} strokeWidth={3} />
                   </button>
                </div>
              )}
            </>
          ) : (
            // --- EMPTY STATE STYLE TRẺ EM ---
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
               <div className="relative mb-6">
                 <div className="absolute inset-0 bg-yellow-200 rounded-full animate-ping opacity-30"></div>
                 <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-[0_8px_0_0_#FDE047]">
                    <ImageIcon className="w-16 h-16 text-yellow-500" />
                 </div>
               </div>
               <h3 className="text-3xl font-black text-slate-700 mb-2">Chưa có tranh nào cả!</h3>
               <p className="text-slate-500 font-medium text-lg max-w-md mx-auto mb-8">
                 Bé hãy vẽ một bức tranh thật đẹp rồi nhờ ba mẹ chụp hình đưa lên đây nhé!
               </p>
               <button 
                 onClick={() => fileInputRef.current?.click()} 
                 disabled={isUploading}
                 className="px-8 py-4 bg-blue-500 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_0_#2563EB] active:shadow-none active:translate-y-1 hover:bg-blue-600 transition-all flex items-center gap-2"
               >
                 <Plus className="w-6 h-6 stroke-[4px]" /> Tải tranh lên
               </button>
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