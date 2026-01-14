"use client";

import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RobotActionUI } from "@/types/robot-ui";
import { RobotScrollablePagination } from "./robot-pagination.dots";
import ErrorState from "@/components/error-state"; // 👈 thêm import

interface RobotActionTabProps {
  actions: RobotActionUI[];
  currentActionIndex: number | null;
  setCurrentActionIndex: Dispatch<SetStateAction<number | null>>;
  sendCommandToBackend: (actionCode: string) => Promise<unknown>;
  onActionSelect: (action: RobotActionUI) => void;
  pageSize: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function  RobotActionTab({
  actions,
  currentActionIndex,
  setCurrentActionIndex,
  sendCommandToBackend,
  onActionSelect,
  pageSize,
  currentPage,
  setCurrentPage,
  totalPages,
  loading,
  error,
}: RobotActionTabProps) {
  // Có thể thêm retry logic (gọi lại API ngoài này nếu bạn có refetch từ React Query)
  const handleRetry = () => {
    // placeholder: có thể gọi invalidateQuery hoặc refetch() tùy hook bạn dùng
    window.location.reload(); // 👈 tạm thời reload trang nếu chưa có refetch
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Trạng thái loading / error */}
      {loading && <p className="text-gray-500 text-sm">⏳ Đang tải...</p>}

      {error && (
        <ErrorState
          error={error}
          onRetry={handleRetry}
          className="mt-6"
        />
      )}

      {!loading && !error && (
        <>
          <div className="flex items-center justify-between w-full mb-4">
            {/* Left Arrow */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Grid */}
            <div className="relative w-full overflow-hidden p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  // responsive grid: 2 cols on xs, 3 on sm, 4 on md+
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
                >
                  {actions.map((actionItem, index) => (
                    <div
                      key={actionItem.id}
                      className="flex flex-col items-center"
                    >
                      <button
                        onClick={() => {
                          setCurrentActionIndex(
                            (currentPage - 1) * pageSize + index
                          );
                          onActionSelect(actionItem);
                          sendCommandToBackend(actionItem.code);
                        }}
                        className={`rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                          currentActionIndex ===
                          (currentPage - 1) * pageSize + index
                            ? `ring-4 ring-offset-2 ring-blue-400 bg-white`
                            : "bg-white hover:bg-gray-100"
                        }`}
                        >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                        {/* Ưu tiên hiển thị icon -> imageUrl -> fallback */}
                        {actionItem.icon ? (
                          <span className="text-2xl">{actionItem.icon}</span>
                        ) : actionItem.imageUrl ? (
                          <Image
                            src={actionItem.imageUrl}
                            alt={actionItem.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="text-2xl">🎬</span>
                        )}
                        </div>
                      </button>
                      <span className="text-xs font-medium text-gray-700 mt-2 text-center truncate max-w-[90px] sm:max-w-[120px]">
                        {actionItem.name}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Pagination dots */}
          <RobotScrollablePagination
            totalPages={totalPages}
            currentPage={currentPage - 1} // dots index từ 0
            setCurrentPage={(p) => setCurrentPage(p + 1)}
          />
        </>
      )}
    </div>
  );
}
