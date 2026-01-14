"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { RobotActionHeader } from "@/components/parent/robot/action/robot-action-header";
import { RobotActionDetail } from "@/components/parent/robot/action/robot-action-detail";
import { RobotActionGrid } from "@/components/parent/robot/action/robot-action-grid";
import { useRobotCommand } from "@/hooks/use-robot-command";
import { useRobotStore } from "@/hooks/use-robot-store";
import { AnimatePresence, motion } from "framer-motion";
import type { RobotAction } from "@/types/robot";
import type { RobotActionUI } from "@/types/robot-ui";

export default function RobotActionsPage() {
  const [notify, setNotifyState] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const notifyTimeoutRef = useRef<number | null>(null);

  const setNotify = useCallback((msg: string, type: "success" | "error") => {
    setNotifyState({ msg, type });
    if (notifyTimeoutRef.current) {
      window.clearTimeout(notifyTimeoutRef.current);
    }
    notifyTimeoutRef.current = window.setTimeout(() => {
      setNotifyState(null);
      notifyTimeoutRef.current = null;
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (notifyTimeoutRef.current) {
        window.clearTimeout(notifyTimeoutRef.current);
      }
    };
  }, []);

  const { sendCommandToBackend } = useRobotCommand(setNotify);

  const [currentAction, setCurrentAction] = useState<RobotAction | RobotActionUI | null>(null);
  const direction = 0;

  const { selectedRobotSerial, robots } = useRobotStore();

  const handleSendCommand = useCallback(
    async (
      actionCode: string,
      type: "action" | "expression" | "skill_helper" | "extended_action" | "process-text" = "action"
    ) => {
      const targets: string[] = Array.isArray(selectedRobotSerial)
        ? selectedRobotSerial
        : selectedRobotSerial
        ? [selectedRobotSerial]
        : [];

      if (targets.length === 0) {
        setNotify("Bạn chưa chọn robot!", "error");
        return;
      }

      const offlineTargets = targets
        .map((s) => robots.find((r) => r.serialNumber === s))
        .filter((r) => r && r.status === "offline") as typeof robots;

      if (offlineTargets.length > 0) {
        setNotify(
          `Một số robot đang offline: ${offlineTargets.map((r) => r?.name || r?.serialNumber).join(", ")}`,
          "error"
        );
      }

      const onlineTargets = targets.filter((s) => !offlineTargets.some((r) => r?.serialNumber === s));
      if (onlineTargets.length === 0) return;

      try {
        const results = await Promise.allSettled(
          onlineTargets.map((serial) => sendCommandToBackend(actionCode, serial, type))
        );

        const succeeded = results.filter((r) => r.status === "fulfilled");
        const failed = results.filter((r) => r.status === "rejected");

        if (failed.length === 0) {
          setNotify(`✅ Đã gửi hành động cho ${succeeded.length} robot.`, "success");
        } else if (succeeded.length === 0) {
          setNotify(`❌ Gửi thất bại cho tất cả ${failed.length} robot.`, "error");
        } else {
          setNotify(`✅ ${succeeded.length} thành công, ❌ ${failed.length} thất bại.`, "success");
        }
      } catch (err) {
        console.error("Unexpected error sending commands:", err);
        setNotify("❌ Gửi lệnh thất bại! Lỗi hệ thống.", "error");
      }
    },
    [selectedRobotSerial, robots, sendCommandToBackend, setNotify]
  );

  const onActionSelect = useCallback((action: RobotAction | RobotActionUI) => {
    setCurrentAction(action);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <RobotActionHeader />

        {currentAction ? (
          <div className="relative">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={currentAction.id}
                custom={direction}
                initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <RobotActionDetail
                  action={{
                    id: currentAction.id,
                    name: currentAction.name,
                    description: "description" in currentAction ? currentAction.description ?? "" : "",
                    code: "code" in currentAction ? currentAction.code : "",
                    duration: "duration" in currentAction ? currentAction.duration ?? 0 : 0,
                    category: "category" in currentAction ? currentAction.category ?? "action" : "action",
                    imageUrl: "imageUrl" in currentAction ? currentAction.imageUrl ?? null : null,
                    icon: "icon" in currentAction ? currentAction.icon ?? null : null,
                    status: "status" in currentAction ? currentAction.status : undefined,
                    statusText: "statusText" in currentAction ? currentAction.statusText ?? "" : "",
                    createdDate: "createdDate" in currentAction ? currentAction.createdDate : undefined,
                    lastUpdate: "lastUpdate" in currentAction ? currentAction.lastUpdate : undefined,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <Image src="/img_action_default.webp" alt="AlphaMini ready" width={256} height={256} className="w-64 h-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">Bấm vào một hành động bên dưới để khiến AlphaMini di chuyển!</h2>
          </div>
        )}

        <RobotActionGrid sendCommandToBackend={handleSendCommand} onActionSelect={onActionSelect} />
      </div>

      {notify && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 ${notify.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {notify.msg}
        </div>
      )}
    </div>
  );
}
