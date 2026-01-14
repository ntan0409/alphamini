import { useMutation } from "@tanstack/react-query";
import { sendRobotCommand } from "@/features/users/api/websocket-api";
import { WebSocketCommand } from "@/types/websocket";
import { toast } from "sonner";

// Hook to send robot command
export const useSendRobotCommand = () => {
  return useMutation({
    mutationFn: ({ serial, command }: { serial: string; command: WebSocketCommand }) =>
      sendRobotCommand(serial, command),
    onSuccess: (data) => {
      toast.success(data?.message || "Lệnh đã gửi thành công!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "Không thể gửi lệnh đến robot";
      toast.error(errorMessage);
    },
  });
};

// ✅ Multi-robot control hook
export const useRobotControls = () => {
  const sendCommand = useSendRobotCommand();

  /**
   * Gửi 1 activity tới 1 hoặc nhiều robot
   * @param serials string | string[]
   * @param type string (ví dụ: "activity" hoặc "process-text")
   * @param data object dữ liệu gửi kèm
   */
  const startActivity = (serials: string | string[], type: string, data: unknown) => {
    const serialArray = Array.isArray(serials) ? serials : [serials];
    const command: WebSocketCommand = {
      type,
      data,
    };

    console.log("🚀 Sending robot command(s):", serialArray, command);

    serialArray.forEach((serial) => {
      sendCommand.mutate({ serial, command });
    });
  };

  return {
    startActivity,
    isLoading: sendCommand.isPending,
    error: sendCommand.error,
  };
};
