"use client";

import { useEffect, useState } from "react";
import { pythonHttp } from "@/utils/http";

export interface RobotStatus {
  serial_number: string;
  firmware_version: string;
  ctrl_version: string;
  battery_level: string;
  is_charging: boolean;
}

export function useRobotStatus(serial: string, intervalMs = 5000) {
  const [status, setStatus] = useState<RobotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm fetch dữ liệu robot
  const fetchStatus = async () => {
  if (!serial) return;

  try {
    setLoading(true);
    const res = await pythonHttp.get<{ data: RobotStatus }>(`/robot/info/${serial}?timeout=10`, {
      headers: { Accept: "application/json" },
    });

    const data = res.data.data;
    setStatus(data);
    setError(null);
  } catch (err: unknown) {
    console.error("❌ Lỗi khi lấy trạng thái robot:", err);
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Lỗi không xác định");
    }
  } finally {
    setLoading(false);
  }
};

  // Gọi khi mount và mỗi interval
  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, intervalMs);
    return () => clearInterval(id);
  }, [serial]);

  return { status, loading, error, refresh: fetchStatus };
}
