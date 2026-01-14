"use client";

import React, { useState, useEffect } from "react";
import { useRobotStore } from "@/hooks/use-robot-store";

// Import UI components
import { RobotPageHeader } from "@/components/parent/robot/robot-page-header";
import { RobotGrid } from "@/components/parent/robot/robot-grid";
import { RobotDetails } from "@/components/parent/robot/robot-details";
import { ProgrammingSection } from "@/components/parent/robot/programming-section";
import { EntertainmentSection } from "@/components/shared/robot/entertainment-section";
import { ThingsToTrySection } from "@/components/parent/robot/things-to-try-section";
import { RobotModal } from "@/app/admin/robot-models/robot-modal";

// Prompts (lightweight list used for the ThingsToTry section)
const thingsToTryPrompts = [
  "Hãy thử cho robot nhảy một điệu nhạc vui nhộn!",
  "Yêu cầu robot kể một câu chuyện cho lớp học.",
  "Hỏi robot về thời tiết hôm nay.",
  "Cho robot chơi trò chơi đoán hình.",
  "Hướng dẫn robot chụp ảnh cùng học sinh.",
  "Thử cho robot hát một bài hát thiếu nhi.",
  "Yêu cầu robot giải thích một khái niệm khoa học đơn giản."
];

export default function UserDashboard() {
  const { robots, selectedRobotSerial, selectRobot, connectMode } = useRobotStore();
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // lightweight shuffle helper (stable and compact)
  const shuffle = (arr: string[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    setShuffledPrompts(shuffle(thingsToTryPrompts));
  }, []);

  useEffect(() => {
    if (connectMode === "single") {
      setSelectedModelName("");
      selectRobot("");
      sessionStorage.removeItem("selectedRobotSerial");
    }
  }, [connectMode]);

  const handleRefreshPrompts = () => setShuffledPrompts(shuffle(thingsToTryPrompts));

  // Use real robots from the store. Filter by model name when provided.
  const filteredRobots = selectedModelName
    ? robots.filter((r) => r.robotModelName === selectedModelName)
    : robots;

  useEffect(() => {
    if (!selectedRobotSerial && filteredRobots.length > 0) {
      const firstSerial = filteredRobots[0].serialNumber || "";
      selectRobot(firstSerial);
      if (firstSerial) sessionStorage.setItem("selectedRobotSerial", firstSerial);
    }
  }, [filteredRobots, selectedRobotSerial]);

  const selectedRobotDetails = filteredRobots.find((robot) => robot.serialNumber === selectedRobotSerial) || null;

  // Map store robot fields to the shape expected by RobotDetails (legacy keys)
  // Create a typed shape for RobotDetails to avoid `any` casts
  type RobotForDetails = {
    id: string;
    name: string;
    status: "online" | "offline" | "charging" | "busy";
    battery?: string | null;
    ctrl_version: string;
    firmware_version: string;
    serialNumber: string;
    robotmodel: string;
  }

  const sel = selectedRobotDetails as unknown as Record<string, unknown>;

  const detailsForRender = selectedRobotDetails
    ? {
        ...selectedRobotDetails,
        ctrl_version: typeof sel.ctrlVersion === 'string' ? sel.ctrlVersion : (typeof sel.ctrl_version === 'string' ? sel.ctrl_version : ""),
        firmware_version: typeof sel.firmwareVersion === 'string' ? sel.firmwareVersion : (typeof sel.firmware_version === 'string' ? sel.firmware_version : ""),
        robotmodel: typeof sel.robotModelName === 'string' ? sel.robotModelName : (typeof sel.robotmodel === 'string' ? sel.robotmodel : ""),
      } as RobotForDetails
    : null;

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 p-4 sm:p-6">
      <RobotPageHeader
        title="Quản lý robot"
        subtitle="Quản lý và tương tác với các robot AlphaMini của bạn"
        onModelSelect={(modelName) => {
          setSelectedModelName(modelName);
          const filtered = robots.filter((r) => r.robotModelName === modelName);
          if (filtered.length > 0) {
            const s = filtered[0].serialNumber || "";
            selectRobot(s);
            if (s) sessionStorage.setItem("selectedRobotSerial", s);
          } else {
            selectRobot("");
            sessionStorage.removeItem("selectedRobotSerial");
          }
        }}
        onAddRobot={() => setIsModalOpen(true)} // 👈 mở modal chọn robot
      />

      <RobotGrid
        robots={filteredRobots.map(r => ({
          ...r,
          serialNumber: r.serialNumber ?? "",
        }))}
        selectedRobot={selectedRobotSerial}
        onRobotSelect={(robotSerial) => {
          selectRobot(robotSerial);
          const robot = filteredRobots.find((r) => r.serialNumber === robotSerial);
          if (robot) {
            sessionStorage.setItem("selectedRobotSerial", robot.serialNumber);
          }
        }}
        sectionTitle="Danh sách robot"
        statusTexts={{
          online: "Đang hoạt động",
          offline: "Ngoại tuyến",
          charging: "Đang sạc"
        }}
      />

      {selectedRobotDetails && (
        <RobotDetails
          robot={detailsForRender as RobotForDetails}
          translations={{
            systemInfo: {
              title: "Thông tin hệ thống",
              firmware: "Phiên bản phần mềm",
              ctrl: "Phiên bản điều khiển",
              robotmodel: "Mẫu robot"
            },
            currentStatus: {
              title: "Trạng thái hiện tại",
              status: "Trạng thái",
              battery: "Pin"
            },
            quickActions: {
              title: "Tác vụ nhanh",
              restart: "Tắt nguồn - Khởi động lại",
              settings: "Cài đặt",
              forceStop: "Dừng hành động"
            },
            statusTexts: {
              online: "Đang hoạt động",
              offline: "Ngoại tuyến",
              charging: "Đang sạc"
            }
          }}
        />
      )}

      <ProgrammingSection
        title="Lập trình"
        items={{
          createActions: "Tạo hành động",
          workspace: "Không gian lập trình",
          myWorks: "Công việc của tôi"
        }}
      />

      <EntertainmentSection
        title="Giải trí"
        items={{
          action: "Hành động vui nhộn",
          album: "Album ảnh",
          friends: "Bạn bè"
        }}
        basePath="/parent"
      />

      <ThingsToTrySection
        title="Những điều nên thử"
        refreshText="Làm mới đề xuất"
        prompts={shuffledPrompts}
        onRefresh={handleRefreshPrompts}
      />

      {/* 🧩 Modal chọn robot */}
      <RobotModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
