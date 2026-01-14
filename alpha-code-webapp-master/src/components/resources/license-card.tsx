"use client";

import { Check, Key } from "lucide-react";
import Link from "next/link";

export default function LicenseCard() {
  return (
    <article className="p-6 border rounded-2xl hover:shadow-lg transition bg-white">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 bg-sky-100 text-sky-700 rounded-xl shadow-inner">
          <Key className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl font-semibold">License Key Cao Cấp</h3>

          <p className="text-gray-600 leading-relaxed">
            Mua <span className="font-semibold text-sky-700">một lần</span> — dùng <span className="font-semibold text-sky-700">trọn đời</span>. Mở khóa toàn bộ tính năng nâng cao không có trong bản miễn phí,
            tối ưu khả năng AI và điều khiển robot. Phù hợp cho cá nhân và doanh nghiệp.
          </p>

          <ul className="mt-3 text-sm text-gray-700 grid gap-2">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-600" /> Nhảy theo nhạc</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-600" /> Chat tiếng Việt & tiếng Anh</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-600" /> Joystick ảo điều khiển robot</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-600" /> APK cao cấp: giọng nói, nhận diện khuôn mặt & vật thể</li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <Link
              href="/license-key"
              className="inline-block px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700 transition"
            >
              Mua ngay — Trọn đời
            </Link>

            <Link
              href="/resources#license"
              className="text-sm text-gray-600 hover:underline"
            >
              Xem chi tiết & hướng dẫn
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
  