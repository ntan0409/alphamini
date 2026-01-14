"use client";

import { Check, Puzzle } from "lucide-react";
import Link from "next/link";

export default function AddonCard() {
  return (
    <article className="p-6 border rounded-2xl hover:shadow-lg transition bg-white">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <Puzzle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">Add-ons nâng cao</h3>
          <p className="mt-2 text-gray-600">
            Mở rộng khả năng của robot với các gói tính năng đặc biệt, giúp học tập và trải nghiệm trở nên thú vị hơn.
          </p>

          <ul className="mt-4 grid gap-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Điều khiển nhà thông minh qua robot
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Robot quét QR code và thực hiện hành động
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Học lập trình cơ bản với Osmo card
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Khối lệnh vật lý và lập trình với Blockly
            </li>
          </ul>

          <div className="mt-4 flex gap-2">
            <Link
              href="/addons"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 transition"
            >
              Khám phá Addon
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
