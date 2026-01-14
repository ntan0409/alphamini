"use client";

import { Check, Mic } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCard() {
  return (
    <article className="p-6 border rounded-2xl hover:shadow-lg transition bg-white">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shadow-inner">
          <Mic className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl font-semibold">Subscription – Giao tiếp giọng nói không giới hạn</h3>
          <p className="text-gray-600 leading-relaxed">
            Gói subscription kích hoạt khả năng <span className="font-semibold">giao tiếp giọng nói tiếng Việt & tiếng Anh</span> 
            với robot thông qua hệ thống AI xử lý ngôn ngữ tự nhiên. Điều khiển robot, trò chuyện và tương tác trong 
            thời gian thực với tốc độ nhanh và ổn định hơn so với bản miễn phí.
          </p>

          <ul className="mt-3 text-sm text-gray-700 grid gap-2">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Trò chuyện không giới hạn với robot (VN/EN)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Ra lệnh bằng giọng nói để robot thực hiện hành động</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Tốc độ phản hồi nhanh hơn & ưu tiên xử lý AI</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Hỗ trợ định kỳ theo tháng hoặc năm (gia hạn tự động)</li>
          </ul>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <Link
              href="/subscription-plan"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Chọn gói ngay
            </Link>
            {/* <Link
              href="/compare/free-vs-subscription"
              className="text-sm text-gray-600 hover:underline"
            >
              So sánh với bản miễn phí
            </Link> */}
          </div>
        </div>
      </div>
    </article>
  );
}
