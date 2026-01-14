import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAction } from "@/features/activities/hooks/use-action"
import { ActionModal, Action } from "@/types/action"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"

interface CreateActionModalProps {
  isOpen: boolean
  onClose: () => void
  editAction?: Action | null
  mode?: "create" | "edit"
}

export function CreateActionModal({
  isOpen,
  onClose,
  editAction = null,
  mode = "create",
}: CreateActionModalProps) {
  const { useCreateAction, useUpdateAction } = useAction()
  const createActionMutation = useCreateAction()
  const updateActionMutation = useUpdateAction()

  // 🧠 State cho robot models
  const [robotModels, setRobotModels] = useState<{ id: string; name: string }[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [modelsError, setModelsError] = useState<string | null>(null)

  useEffect(() => {
    setLoadingModels(true)
    getAllRobotModels()
      .then((data) => {
        setRobotModels(
          (data?.data || []).map((m: { id: string; name: string }) => ({
            id: m.id,
            name: m.name,
          }))
        )
        setModelsError(null)
      })
      .catch(() => {
        setModelsError("Không thể tải danh sách robot model")
      })
      .finally(() => setLoadingModels(false))
  }, [])

  const isEditMode = mode === "edit" && editAction

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActionModal & { robotModelId?: string }>({
    defaultValues: {
      robotModelId: undefined,
      code: "",
      name: "",
      description: "",
      duration: 60,
      status: 1,
      canInterrupt: true,
      icon: "",
      type: 1,
    },
  })

  // 🧩 Cập nhật dữ liệu khi vào chế độ edit
  useEffect(() => {
    if (isEditMode && editAction) {
      reset({
        robotModelId: editAction.robotModelId || undefined,
        code: editAction.code,
        name: editAction.name,
        description: editAction.description,
        duration: editAction.duration,
        status: editAction.status,
        canInterrupt: editAction.canInterrupt,
        icon: editAction.icon,
        type: editAction.type || 1,
      })
    } else {
      reset({
        robotModelId: undefined,
        code: "",
        name: "",
        description: "",
        duration: 60,
        status: 1,
        canInterrupt: true,
        icon: "",
        type: 1,
      })
    }
  }, [editAction, isEditMode, reset])

  const canInterrupt = watch("canInterrupt")
  const status = watch("status")
  const robotModelId = watch("robotModelId")
  const type = watch("type")

  const onSubmit = async (data: ActionModal & { robotModelId?: string }) => {
    try {
      const submitData = { ...data, robotModelId }

      if (isEditMode && editAction) {
        await updateActionMutation.mutateAsync({ id: editAction.id, data: submitData })
        toast.success("Cập nhật hành động thành công!")
      } else {
        await createActionMutation.mutateAsync(submitData)
        toast.success("Tạo hành động thành công!")
      }

      reset()
      onClose()
    } catch (error) {
      console.error("Error saving action:", error)
      toast.error(isEditMode ? "Cập nhật thất bại" : "Tạo mới thất bại")
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa hành động" : "Tạo hành động mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin hành động."
              : "Nhập thông tin để tạo hành động mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 🧠 Dropdown chọn Robot Model */}
          <div className="space-y-2">
            <Label htmlFor="robotModelId">Chọn Robot Model</Label>
            <Select
              value={robotModelId || ""}
              onValueChange={(value) => setValue("robotModelId", value)}
              disabled={loadingModels}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingModels ? "Đang tải..." : "Chọn model"} />
              </SelectTrigger>
              <SelectContent>
                {robotModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {modelsError && <p className="text-sm text-red-500">{modelsError}</p>}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Mã hành động *</Label>
            <Input
              id="code"
              {...register("code", {
                required: "Vui lòng nhập mã hành động",
                minLength: { value: 2, message: "Mã hành động phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập mã hành động"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên hành động *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên hành động",
                minLength: { value: 2, message: "Tên hành động phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên hành động"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Nhập mô tả cho hành động"
              rows={3}
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Textarea id="icon" {...register("icon")} placeholder="Nhập icon (nếu có)" rows={3} />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Thời lượng (giây) *</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", {
                required: "Vui lòng nhập thời lượng",
                min: { value: 1, message: "Thời lượng tối thiểu là 1 giây" },
                valueAsNumber: true,
              })}
              placeholder="60"
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={status.toString()} onValueChange={(v) => setValue("status", parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>Kích hoạt
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>Không kích hoạt
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Can Interrupt */}
          <div className="flex items-center space-x-3">
            <Switch
              id="canInterrupt"
              checked={canInterrupt}
              onCheckedChange={(checked) => setValue("canInterrupt", checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="canInterrupt" className="text-sm font-medium cursor-pointer">
              Có thể ngắt giữa chừng
            </Label>
          </div>

          {/* Type - Cường độ */}
          <div className="space-y-2">
            <Label htmlFor="type">Cường độ *</Label>
            <Select value={type?.toString() || "1"} onValueChange={(v) => setValue("type", parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn cường độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-300 rounded-full"></span>Yếu
                  </span>
                </SelectItem>
                <SelectItem value="2">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Trung bình
                  </span>
                </SelectItem>
                <SelectItem value="3">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>Mạnh
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Đóng
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
