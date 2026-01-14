"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import imageFallback from "../../../public/img_fallback.png";
import { useRobot } from "@/features/robots/hooks/use-robot";
import { useRobotInfo } from "@/features/robots/hooks/use-robot-info";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { useRobotStore } from "@/hooks/use-robot-store";
import { RobotModal } from "@/app/admin/robot-models/robot-modal";
import { Battery, Zap, WifiOff, Wifi } from "lucide-react";

interface RobotSelectorProps {
  className?: string;
  compact?: boolean; // when true render a compact avatar-only trigger for small headers
}

export function RobotSelector({ className = "", compact = false }: RobotSelectorProps) {
  const [accountId, setAccountId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    robots,
    selectedRobotSerial,
    selectRobot,
    addRobot,
    updateRobotStatus,
    updateRobotBattery,
    updateRobotInfo,
    connectMode,
  } = useRobotStore();

  const isMultiMode =
    connectMode === "multi" ||
    (Array.isArray(selectedRobotSerial) && selectedRobotSerial.length > 1);

  // Lấy accountId từ token
  useEffect(() => {
    // Sửa lỗi tham chiếu window khi server-side rendering
    const token = typeof window !== 'undefined' ? sessionStorage.getItem("accessToken") : null;
    if (token) {
      const userId = getUserIdFromToken(token);
      if (userId) setAccountId(userId);
    }
  }, []);

  // Lấy robots từ API
  const { useGetRobotsByAccountId } = useRobot();
  const { data: robotsResponse, isLoading, error } = useGetRobotsByAccountId(accountId);
  const robotsApi = robotsResponse?.data || [];

  // Add robots vào Redux store
  useEffect(() => {
    robotsApi.forEach((r) => {
      if (r.accountId === accountId) {

        addRobot({
          id: r.id,
          serialNumber: r.serialNumber,
          name: r.robotModelName || "Unknown Robot",
          status: r.status === 1 ? "online" : "offline",
          battery: r.battery,
          robotModelId: r.robotModelId,
          robotModelName: r.robotModelName,
          accountId: r.accountId,
        });
      }
    });
  }, [robotsApi, addRobot, accountId]);

  // Chọn robot đầu tiên nếu chưa chọn
  useEffect(() => {
  if (typeof window !== "undefined") {
    const savedSerial = localStorage.getItem("selectedRobotSerial");
    if (savedSerial && robotsApi.some(r => r.serialNumber === savedSerial)) {
      selectRobot(savedSerial);
    }
  }
}, [robotsApi, selectRobot]);

  // Poll status & battery cho tất cả robot
  const { useGetMultipleRobotInfo } = useRobotInfo();
  const serialList = useMemo(() => robots.map((r) => r.serialNumber), [robots]);
  const robotInfos = useGetMultipleRobotInfo(
    serialList,
    3, // ✅ ĐIỀU CHỈNH: Giảm Polling Interval xuống 3 giây
    { enabled: robots.length > 0 }
  );

  // Snapshot the important fields (avoid devtools live object expansion)
  try {
    // console.log(
    //   "Robot Polling Snapshot:",
    //   JSON.stringify(
    //     robotInfos.map((info, i) => ({
    //       requestedSerial: serialList[i],
    //       infoSerialField: info.serial,
    //       returned__requestedSerial: info.data?.__requestedSerial,
    //       returnedSerialInsideData: info.data?.data?.serial_number,
    //       status: info.status,
    //       isLoading: info.isLoading,
    //     })),
    //     null,
    //     2
    //   )
    // );
  } catch (e) {
    console.log("Robot Polling: (could not stringify)", robotInfos);
  }
  // Cập nhật Redux store theo poll
  useEffect(() => {
    robotInfos.forEach((info) => {
      const apiData = info.data?.data;
      const apiStatus = info.data?.status;
      const apiMessage = info.data?.message;

      const existing = robots.find((r) => r.serialNumber === info.serial);
      if (!existing) return;

      // Safety guard: ensure the returned payload corresponds to the requested serial.
      const requestedSerial = info.serial;
      const annotatedRequested = info.data?.__requestedSerial;
      const returnedSerial = apiData?.serial_number;

      if (annotatedRequested && annotatedRequested !== requestedSerial) {
        console.warn(
          `[Robot Polling] annotated requested serial mismatch, requested=${requestedSerial}, annotated=${annotatedRequested}. Skipping update.`
        );
        return;
      }

      if (returnedSerial && returnedSerial !== requestedSerial) {
        console.warn(
          `[Robot Polling] returned serial (${returnedSerial}) does not match requested (${requestedSerial}). Skipping update.`
        );
        return;
      }

      let newStatus = existing.status;
      let newBattery = existing.battery; // Redux store lưu string/null

      // 1. Logic OFFLINE: Khi API báo lỗi nội bộ hoặc không có dữ liệu
      if (!info.data || apiStatus === "error") {
        let isOffline = false;

        // Kiểm tra message chỉ ra lỗi kết nối
        if (apiMessage && apiMessage.includes("not connected via WebSocket")) {
          isOffline = true;
        } else if (apiData && Object.keys(apiData).length === 0) {
          isOffline = true;
        }

        if (isOffline) {
          newStatus = "offline";
        }
      } else {
        // 2. Logic ONLINE / CHARGING 
        // const data = apiData; // 🛑 Lỗi có thể xảy ra ở đây nếu apiData chưa được chắc chắn tồn tại

        const data = apiData;

        // ✅ THÊM KIỂM TRA RÕ RÀNG
        if (!data) {
          // Nếu info.data tồn tại nhưng data bên trong lại là null/undefined (không mong muốn)
          newStatus = "offline";
        } else {
          // ✅ Lúc này, TypeScript biết 'data' chắc chắn là RobotInfo
          // Cập nhật trạng thái
          newStatus = data.is_charging ? "charging" : "online";

          // Cập nhật pin
          if (data.battery_level != null) {
            newBattery = String(data.battery_level);
          }

          // Cập nhật firmware / ctrl version vào store **chỉ khi thay đổi**
          try {
            const needUpdateFirmware = existing.firmwareVersion !== data.firmware_version;
            const needUpdateCtrl = existing.ctrlVersion !== data.ctrl_version;
            if (needUpdateFirmware || needUpdateCtrl) {
              updateRobotInfo({
                serial: info.serial,
                ...(needUpdateFirmware ? { firmwareVersion: data.firmware_version } : {}),
                ...(needUpdateCtrl ? { ctrlVersion: data.ctrl_version } : {}),
              });
            }
          } catch (e) {
            // ignore
          }
        }
      }

      // Cập nhật trạng thái chỉ khi có thay đổi
      if (existing.status !== newStatus) {
        updateRobotStatus(info.serial, newStatus);
      }

      // Cập nhật pin chỉ khi có thay đổi (kích hoạt re-render)
      if (existing.battery !== newBattery && newBattery != null) {
        console.log(`[BatteryUpdate] ${info.serial}: ${existing.battery} → ${newBattery}`);
        updateRobotBattery(info.serial, newBattery);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robotInfos]);

  const handleRobotSelect = (serial: string) => {
  selectRobot(serial);
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedRobotSerial", serial);
  }
};

  // Render display robot
  const displayRobots = robots
    .filter((r) => r.accountId === accountId)
    .map((r) => ({
      ...r,
      avatar:
        r.status === "online" || r.status === "charging"
          ? "/img_top_alphamini_connect.webp"
          : "/img_top_alphamini_disconnect.webp",
    }));


  const selectedSerials = Array.isArray(selectedRobotSerial)
    ? selectedRobotSerial
    : selectedRobotSerial
      ? [selectedRobotSerial]
      : [];

  const selectedRobots = displayRobots.filter((r) => selectedSerials.includes(r.serialNumber));

  const displayName =
    selectedRobots.length === 0
      ? "Chưa có robot nào"
      : isMultiMode
        ? `${selectedRobots.length} robots được chọn`
        : selectedRobots[0].name;

  const displayAvatar =
    isMultiMode && selectedRobots.length > 1
      ? "/img_action_introduction.png"
      : selectedRobots[0]?.avatar ?? "/img_top_alphamini_disconnect.webp";

  if (isLoading) {
    if (compact) {
      return (
        <div className={`flex items-center justify-center p-1 rounded-full bg-gray-50 border border-gray-100 ${className}`} title="Đang tải robots...">
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        </div>
      );
    }

    return (
      // Allow shrinking on small screens so header doesn't overflow
      <div className={`flex items-center px-2 py-1 rounded-xl shadow border border-gray-100 bg-gray-50 min-w-0 sm:min-w-[260px] ${className}`}>
        <div className="text-gray-500 text-sm">Đang tải robots...</div>
      </div>
    );
  }

  if (error || displayRobots.length === 0) {
    if (compact) {
      return (
        <div className={`flex items-center justify-center p-1 rounded-full bg-blue-50 border border-blue-100 ${className}`} title="Chưa có robot">
          <button onClick={() => setIsModalOpen(true)} className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">＋</button>
          <RobotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      );
    }

    return (
      <div
        // Allow shrinking on small screens; keep wider min-width on sm+
        className={`flex items-center justify-between px-3 py-2 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors min-w-0 sm:min-w-[260px] ${className}`}
      >
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-gray-900 text-sm">Chưa có robot nào</span>
          <span className="text-xs text-gray-500 mt-0.5">Hãy thêm robot để bắt đầu</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-3 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Thêm mới
        </button>

        <RobotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            // Make trigger shrinkable on small screens so header layout stays intact
            className={`flex items-center px-3 py-2 rounded-xl shadow border border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none min-w-0 sm:min-w-[260px] ${className}`}
          >
            <Image src={displayAvatar} alt="AlphaMini" width={50} height={50} className="object-cover object-top rounded-lg" />
            <div className="flex flex-col justify-center ml-3 leading-tight text-left min-w-0">
              <span className="font-semibold text-base text-gray-900 truncate">{displayName}</span>
              <span className="text-xs text-gray-500 font-mono tracking-wide mt-0.5 truncate max-w-[120px] sm:max-w-[180px]">
                {isMultiMode ? "Multi mode" : selectedRobots[0]?.serialNumber ?? ""}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-96" side="bottom" align="end" sideOffset={8} forceMount>
          <DropdownMenuLabel className="font-semibold text-base mb-2">
            {isMultiMode ? "Chọn nhiều Robot" : "Chọn Robot"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {displayRobots.map((robot) => {
              const isSelected = selectedSerials.includes(robot.serialNumber);
              return (
                <DropdownMenuItem
                  key={robot.id}
                  onClick={() => handleRobotSelect(robot.serialNumber)}
                  className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer ${isSelected ? "bg-blue-50" : ""}`}
                >
                  <Avatar className="h-9 w-9 rounded-none overflow-hidden flex-shrink-0">
                    <AvatarImage src={robot.avatar} alt={robot.name} />
                    <AvatarFallback>
                      <Image src={imageFallback} alt={robot.name} width={36} height={36} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 text-sm truncate">{robot.name}</span>
                      <div className="flex-shrink-0">
                        {robot.status === "online" && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600 flex items-center gap-1"><Wifi size={12} />Online</span>}
                        {robot.status === "charging" && <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-600 flex items-center gap-1"><Zap size={12} />Charging</span>}
                        {robot.status === "offline" && <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 flex items-center gap-1"><WifiOff size={12} />Offline</span>}
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-2 mt-1">
                      <span className="text-xs text-gray-400 truncate font-mono">{robot.serialNumber}</span>
                      {robot.status !== "offline" && robot.battery != null && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                          <Battery size={12} />
                          <span>{robot.battery}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && <span className="ml-2 text-blue-600 font-bold flex-shrink-0">✓</span>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 py-2 px-2 text-blue-600 hover:bg-blue-50 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <span className="text-lg">＋</span>
            <span className="font-medium">Thêm Robot mới</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RobotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}