"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRobotModels } from "@/features/robots/api/robot-model-api";
import { createRobot } from "@/features/robots/api/robot-api";
import { getAllAccounts } from "@/features/users/api/account-api";
import { Account } from "@/types/account";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getUserIdFromToken } from "@/utils/tokenUtils";

interface RobotModalProps {
  open: boolean;
  onClose: () => void;
}

// ===============================
// AccountSelect Component (nếu cần bật lại sau)
// ===============================
interface AccountSelectProps {
  selectedAccountId: string;
  onChange: (id: string) => void;
}

export function AccountSelect({ selectedAccountId, onChange }: AccountSelectProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await getAllAccounts();
        setAccounts(res.data);
      } catch (err) {
        console.error("Failed to load accounts:", err);
        toast.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 italic">Đang tải danh sách người dùng...</div>
    );
  }

  return (
    <div className="space-y-1">
      <Label>Người sử dụng</Label>
      <Select value={selectedAccountId} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Chọn người dùng" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((acc) => (
            <SelectItem key={acc.id} value={acc.id}>
              {acc.fullName} ({acc.roleName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ===============================
// RobotModal Component
// ===============================
export const RobotModal: React.FC<RobotModalProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [accountId, setAccountId] = useState<string>("");
  const [robotModelId, setRobotModelId] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");

  interface RobotModel {
    id: string;
    name: string;
    firmwareVersion: string;
  }

  // 🔹 Fetch model list
  const { data: models, isLoading: loadingModels } = useQuery<RobotModel[]>({
    queryKey: ["robotModels"],
    queryFn: async () => {
      const res = await getAllRobotModels();
      return res.data || [];
    },
  });

  // 🔹 Create mutation
  const { mutate: createNewRobot, isPending } = useMutation({
    mutationFn: createRobot,
    onSuccess: () => {
      toast.success("Tạo robot thành công!");
      queryClient.invalidateQueries({ queryKey: ["robots"] });
      onClose();
      setSerialNumber("");
      setRobotModelId("");
      setAccountId("");
    },
    onError: (err: unknown) => {
      let message = "Không thể tạo robot.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          message = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const token = sessionStorage.getItem("accessToken") || "";
    const userId = getUserIdFromToken(token);

    if (!robotModelId || !serialNumber || !userId) {
      toast.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const selectedModel = models?.find((m) => m.id === robotModelId);
    const robotModelName = selectedModel?.name || "";

    if (!robotModelName) {
      toast.error("Không tìm thấy thông tin model robot.");
      return;
    }

    // 🔹 Luôn gửi status = 1
    createNewRobot({
      accountId: userId,
      robotModelId,
      serialNumber,
      status: 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm Robot Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Model Dropdown */}
          <div>
            <Label>Model Robot</Label>
            <Select onValueChange={setRobotModelId} value={robotModelId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingModels ? "Đang tải..." : "Chọn model robot"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {models?.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.firmwareVersion})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Serial Number */}
          <div>
            <Label>Serial Number</Label>
            <Input
              placeholder="Nhập số serial của robot"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          {/* Status bị ẩn hoàn toàn */}

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
