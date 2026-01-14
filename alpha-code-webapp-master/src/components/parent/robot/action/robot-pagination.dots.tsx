"use client";

import { useState, useMemo, useEffect } from 'react';

export function RobotScrollablePagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (index: number) => void;
}) {
  // --- Cấu hình ---
  const visibleDots = 7; // Số lượng dots hiển thị tại một thời điểm
  
  // Tính toán startIndex ban đầu dựa trên currentPage (để load đúng nhóm)
  const initialGroup = Math.floor(currentPage / visibleDots) * visibleDots;
  const [startIndex, setStartIndex] = useState(initialGroup);

  // Tính toán startIndex tối đa (index của nhóm cuối cùng)
  const maxStartIndex = (Math.ceil(totalPages / visibleDots) - 1) * visibleDots;

  // --- LOGIC TỰ ĐỘNG DỊCH CHUYỂN ---
  // [MỚI] Tự động dịch chuyển nhóm (startIndex) khi currentPage thay đổi
  useEffect(() => {
    // Tính toán nhóm (startIndex) mà currentPage thuộc về
    const currentGroupStartIndex = Math.floor(currentPage / visibleDots) * visibleDots;
    
    // Chỉ cập nhật (dịch chuyển) nếu nó khác với nhóm đang hiển thị
    if (currentGroupStartIndex !== startIndex) {
      setStartIndex(currentGroupStartIndex);
    }
    // Phụ thuộc vào currentPage để chạy lại khi nó thay đổi
  }, [currentPage, visibleDots, startIndex]);

  // Tính toán các dots cần hiển thị
  const displayedPages = useMemo(() => {
    const pages = [];
    // Đảm bảo không render quá totalPages
    const end = Math.min(startIndex + visibleDots, totalPages);
    for (let i = startIndex; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }, [startIndex, totalPages, visibleDots]);

  // --- Hàm xử lý cho nút ---
  const handlePrevGroup = () => {
    setStartIndex(prev => Math.max(0, prev - visibleDots));
  };

  const handleNextGroup = () => {
    setStartIndex(prev => Math.min(prev + visibleDots, maxStartIndex));
  };

  // --- Điều kiện hiển thị ---
  const isAtStart = startIndex === 0;
  const isAtEnd = startIndex >= maxStartIndex;
  
  // Ẩn các nút mũi tên nếu không đủ trang để cuộn
  const showArrows = totalPages > visibleDots;

  // Không hiển thị gì nếu chỉ có 1 trang
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-2 items-center space-x-2">
      {/* Nút Previous Group */}
      {showArrows && (
        <button
          onClick={handlePrevGroup}
          disabled={isAtStart}
          className={`p-2 rounded-full transition-colors ${
            isAtStart ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-label="Previous group of pages"
        >
          {/* SVG icon < */}
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </button>
      )}

      {/* Các Pagination Dots */}
      <div className="flex space-x-2 overflow-hidden">
        {displayedPages.map((p) => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            aria-label={`Go to page ${p + 1}`}
            title={`Go to page ${p + 1}`}
            className={`w-8 h-2 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              p === currentPage 
                ? "bg-blue-500 w-10" // Dot active rộng hơn
                : "bg-gray-300 hover:bg-gray-400" // Dot thường
            }`}
          />
        ))}
      </div>

      {/* Nút Next Group */}
      {showArrows && (
        <button
          onClick={handleNextGroup}
          disabled={isAtEnd}
          className={`p-2 rounded-full transition-colors ${
            isAtEnd ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-label="Next group of pages"
        >
          {/* SVG icon > */}
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
      )}
    </div>
  );
}