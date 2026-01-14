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

// Prompts
const thingsToTryPrompts = [
  "Hãy thử cho robot nhảy một điệu nhạc vui nhộn!",
  "Yêu cầu robot kể một câu chuyện cho lớp học.",
  "Hỏi robot về thời tiết hôm nay.",
  "Cho robot chơi trò chơi đoán hình.",
  "Hướng dẫn robot chụp ảnh cùng học sinh.",
  "Thử cho robot hát một bài hát thiếu nhi.",
  "Yêu cầu robot giải thích một khái niệm khoa học đơn giản."
];

interface ExtendedRobot {
  id: string;
  name: string;
  status: "online" | "offline" | "charging" | "busy";
  battery?: string | null;
  lastSeen: string;
  version: string;
  ctrl_version: string;
  firmware_version: string;
  students: number;
  image: string;
  serialNumber: string;
  robotmodel: string | undefined;
}

// Shuffle helper
function shuffleArray(array: string[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function extendRobotWithMockData(
  robot: ReturnType<typeof useRobotStore>["robots"][0],
  index: number
): ExtendedRobot {
  const mockData = [
    {
      lastSeen: "2 minutes ago",
      version: "v2.1.3",
      students: 6,
      currentTask: "Teaching Colors",
      uptime: "4h 23m",
      ip: "192.168.1.101",
      temperature: 32,
      image: "/alpha-mini-2.webp"
    },
    {
      lastSeen: "1 minute ago",
      version: "v2.1.3",
      students: 4,
      currentTask: "Programming Basics",
      uptime: "3h 45m",
      ip: "192.168.1.102",
      temperature: 29,
      image: "/alpha-mini-2.webp"
    },
    {
      lastSeen: "5 minutes ago",
      version: "v2.1.2",
      students: 2,
      currentTask: "Charging",
      uptime: "1h 12m",
      ip: "192.168.1.103",
      temperature: 26,
      image: "/alpha-mini-2.webp"
    }
  ];

  const mockInfo = mockData[index] || mockData[0];
  return {
    id: robot.id,
    name: robot.name,
    status: robot.status || "offline",
    battery: robot.battery || "",
    ctrl_version: robot.ctrlVersion ?? "",
    firmware_version: robot.firmwareVersion ?? "",
    serialNumber: robot.serialNumber,
    robotmodel: robot.robotModelName ?? "",
    ...mockInfo
  };
}

export default function UserDashboard() {
  const { robots, selectedRobotSerial, selectRobot, initializeMockData, connectMode } = useRobotStore();
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initializeMockData();
  }, []);

  useEffect(() => {
    setShuffledPrompts(shuffleArray(thingsToTryPrompts));
  }, []);

  useEffect(() => {
    if (connectMode === "single") {
      setSelectedModelName("");
      selectRobot("");
      sessionStorage.removeItem("selectedRobotSerial");
    }
  }, [connectMode]);

  const handleRefreshPrompts = () => {
    setShuffledPrompts(shuffleArray(thingsToTryPrompts));
  };

  const extendedRobots: ExtendedRobot[] = robots.map((robot, index) =>
    extendRobotWithMockData(robot, index)
  );

  const filteredRobots = selectedModelName
    ? extendedRobots.filter((r) => r.robotmodel === selectedModelName)
    : extendedRobots;

  useEffect(() => {
    if (!selectedRobotSerial && filteredRobots.length > 0) {
      selectRobot(filteredRobots[0].serialNumber);
      sessionStorage.setItem("selectedRobotSerial", filteredRobots[0].serialNumber);
    }
  }, [filteredRobots, selectedRobotSerial]);

  const selectedRobotDetails =
    filteredRobots.find((robot) => robot.serialNumber === selectedRobotSerial) || null;

  return (
    <div className="space-y-10 p-10">
      <RobotPageHeader
        title="Quản lý robot"
        subtitle="Quản lý và tương tác với các robot AlphaMini của bạn"
        onModelSelect={(modelName) => {
          setSelectedModelName(modelName);
          const filtered = extendedRobots.filter((r) => r.robotmodel === modelName);
          if (filtered.length > 0) {
            selectRobot(filtered[0].serialNumber);
            sessionStorage.setItem("selectedRobotSerial", filtered[0].serialNumber);
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
          robot={selectedRobotDetails}
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
        basePath="/children"
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
