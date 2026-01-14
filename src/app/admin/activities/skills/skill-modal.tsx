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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSkill } from "@/features/activities/hooks/use-skill"
import { Skill } from "@/types/skill"
import { useEffect, useState } from "react"
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"
import { toast } from "sonner"

interface CreateSkillModalProps {
  isOpen: boolean
  onClose: () => void
  editSkill?: Skill | null
  mode?: "create" | "edit"
}

export function CreateSkillModal({
  isOpen,
  onClose,
  editSkill = null,
  mode = "create",
}: CreateSkillModalProps) {
  // ✅ gọi hooks ở đây (đúng chỗ)
  const { useCreateSkill, useUpdateSkill } = useSkill()
  const createSkillMutation = useCreateSkill()
  const updateSkillMutation = useUpdateSkill()

  // State for robot models
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

  const isEditMode = mode === "edit" && editSkill

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Skill & { robotModelId?: string }>({
    defaultValues: {
      code: "",
      name: "",
      icon: "",
      status: 1,
      robotModelId: undefined,
    },
  })

  useEffect(() => {
    if (isEditMode && editSkill) {
      reset({
        code: editSkill.code,
        name: editSkill.name,
        icon: editSkill.icon,
        status: editSkill.status,
        robotModelId: editSkill.robotModelId || undefined,
      })
    } else {
      reset({
        code: "",
        name: "",
        icon: "",
        status: 1,
        robotModelId: undefined,
      })
    }
  }, [editSkill, isEditMode, reset])

  const status = watch("status")
  const robotModelId = watch("robotModelId")

  const onSubmit = async (data: Skill & { robotModelId?: string }) => {
    try {
      const submitData = { ...data, robotModelId }
      if (isEditMode && editSkill) {
        await updateSkillMutation.mutateAsync({ id: editSkill.id, skillData: submitData })
        toast.success("Cập nhật kỹ năng thành công!")
      } else {
        await createSkillMutation.mutateAsync(submitData)
        toast.success("Tạo kỹ năng thành công!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving skill:", error)
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
          <DialogTitle>{isEditMode ? "Chỉnh sửa kỹ năng" : "Tạo kỹ năng mới"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin kỹ năng."
              : "Nhập thông tin để tạo kỹ năng mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Robot Model Dropdown */}
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

          {/* Skill Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Mã kỹ năng *</Label>
            <Input
              id="code"
              {...register("code", {
                required: "Vui lòng nhập mã kỹ năng",
                minLength: { value: 2, message: "Mã kỹ năng phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập mã kỹ năng"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          {/* Skill Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên kỹ năng *</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Vui lòng nhập tên kỹ năng",
                minLength: { value: 2, message: "Tên kỹ năng phải có ít nhất 2 ký tự" },
              })}
              placeholder="Nhập tên kỹ năng"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="icon">Hình ảnh (string)</Label>
            <Input id="icon" type="text" {...register("icon")} placeholder="Nhập chuỗi hình ảnh hoặc icon" />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditMode ? "Đang cập nhật..." : "Đang tạo...") : isEditMode ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
