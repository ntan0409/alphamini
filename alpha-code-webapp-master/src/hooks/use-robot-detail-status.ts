import { useRobotStatus } from "@/hooks/use-robot-status";

export function useRobotDetailStatus(serial: string) {
  const { status, loading, error } = useRobotStatus(serial, 5000);
  return { status, loading, error };
}