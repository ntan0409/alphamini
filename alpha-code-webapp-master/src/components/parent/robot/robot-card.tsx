"use client";

import React from "react";
import { useRobotStatus } from "@/hooks/use-robot-status";
import Image from "next/image";
import { Battery, MapPin, CheckCircle, WifiOff, Zap, Activity } from "lucide-react";

export interface Robot {
  serialNumber: string;
  name: string;
  image: string;
  location?: string;
}

interface RobotCardProps {
  robot: Robot;
  selectedRobot: string | null;
  onRobotSelect: (serial: string) => void;
  statusTexts: {
    online: string;
    offline: string;
    charging: string;
  };
}

export function RobotCard({ robot, selectedRobot, onRobotSelect, statusTexts }: RobotCardProps) {
  const { status } = useRobotStatus(robot.serialNumber, 5000);

  const battery = status?.battery_level ?? "0";
  const isCharging = status?.is_charging ?? false;
  const isOnline = !!status;

  

  const computedStatus = isCharging ? "charging" : isOnline ? "online" : "offline";

  const getStatusIcon = () => {
    switch (computedStatus) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case "charging":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (computedStatus) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "charging":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (battery: string) => {
    if (battery > "60") return "bg-green-500";
    if (battery > "30") return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = () => {
    return statusTexts[computedStatus as keyof typeof statusTexts] || computedStatus;
  };

  return (
    <div
      className={`min-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col items-center transition-transform duration-200 hover:scale-105 cursor-pointer ${
        selectedRobot === robot.serialNumber ? "ring-2 ring-blue-400" : ""
      }`}
      onClick={() => onRobotSelect(robot.serialNumber)}
    >
      <Image
        src={robot.image}
        alt={robot.name}
        width={80}
        height={80}
        className="rounded-full object-cover mb-2"
      />
      <span className="font-bold text-lg text-gray-900 mb-1">{robot.name}</span>
      <span className="text-xs text-gray-400 mb-2">{robot.serialNumber}</span>
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Battery className="h-4 w-4" />
        <span className="font-semibold text-sm">{battery}%</span>
        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-2 rounded-full ${getBatteryColor(battery)}`} style={{ width: `${battery}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-blue-400" />
        <span className="text-sm text-gray-600">{robot.location}</span>
      </div>
    </div>
  );
}
