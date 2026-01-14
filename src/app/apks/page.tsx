"use client";

import { useState, useEffect } from "react";
import ApkList from "@/components/apks/apk-list";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ApksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [size] = useState(12);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedModel]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Ứng dụng Robot <span className="text-rose-600">(APK)</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Tải xuống ứng dụng APK cho robot của bạn. Chọn phiên bản phù hợp với model robot và cài đặt để mở khóa các tính năng điều khiển và tương tác.
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm theo phiên bản, mô tả hoặc model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* APK List */}
          <main>
            <ApkList
              page={page}
              size={size}
              search={debouncedSearch}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              onPageChange={setPage}
            />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
