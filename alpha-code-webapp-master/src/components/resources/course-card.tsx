"use client";

import { Book } from "lucide-react";
import Link from "next/link";

export default function CourseCard() {
  return (
    <article className="p-6 border rounded-2xl hover:shadow-lg transition bg-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
          <Book className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">Khóa học chuyên sâu điều khiển robot AI</h3>
          <p className="mt-2 text-gray-600">
            Học cách giao tiếp tiếng Anh - tiếng Việt với robot, tạo kịch bản hội thoại, lập trình hành vi,
            điều khiển chuyển động, xây dựng trợ lý AI thực tế và triển khai vào lớp học / cuộc sống.
            Khi nhấn vào, bạn sẽ được chuyển tới trang đăng ký khóa học chi tiết.
          </p>

          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div>
                <div className="text-sm font-medium">Giao tiếp giọng nói song ngữ (EN-VN)</div>
                <div className="text-xs text-gray-500">4 buổi • Thực hành ra lệnh giọng nói</div>
              </div>
              <Link href="/course" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition">Đăng ký ngay</Link>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div>
                <div className="text-sm font-medium">Lập trình kịch bản & hành vi robot</div>
                <div className="text-xs text-gray-500">6 buổi • Điều phối chuyển động & cảm xúc</div>
              </div>
              <Link href="/course" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition">Đăng ký ngay</Link>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div>
                <div className="text-sm font-medium">Tạo trợ lý AI hỗ trợ học tập</div>
                <div className="text-xs text-gray-500">5 buổi • Giai đoạn: beginner → thực chiến</div>
              </div>
              <Link href="/course" className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition">Đăng ký ngay</Link>
            </div>
          </div>

          <div className="mt-4">
            <Link href="/course" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition">Xem toàn bộ lộ trình học</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
