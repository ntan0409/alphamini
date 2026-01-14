"use client";

import { Check, Download } from "lucide-react";
import Link from "next/link";

export default function ApkCard() {
  return (
    <article className="p-6 border rounded-2xl hover:shadow-lg transition bg-white flex items-start gap-4">
      {/* Icon */}
      <div className="p-3 bg-rose-100 text-rose-600 rounded-xl shadow-sm">
        <Download className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <h3 className="text-2xl font-semibold">Ứng dụng Robot (APK)</h3>
        <p className="text-gray-600 leading-relaxed">
          Bộ sưu tập ứng dụng độc quyền được thiết kế dành riêng cho robot AlphaCode
          và các thiết bị Android tương thích. Khách hàng có thể tải và cài đặt để
          mở khóa các khả năng điều khiển, tương tác AI và học tập thông minh.
        </p>

        <ul className="mt-3 text-sm text-gray-700 grid gap-2">
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600" /> Tối ưu cho robot Alpha Mini</li>
          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-rose-600" /> Cập nhật phiên bản thường xuyên</li>
        </ul>

        <Link
          href="/apks"
          className="inline-block mt-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition"
        >
          Khám phá danh sách APK →
        </Link>
      </div>
    </article>
  );
}
