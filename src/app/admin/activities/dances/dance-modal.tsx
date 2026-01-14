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
import { useDance } from "@/features/activities/hooks/use-dance"
import { DanceModal, Dance } from "@/types/dance"
import { useEffect } from "react"
import { toast } from "sonner"
import { useRobotModel } from "@/features/robots/hooks/use-robot-model"

interface CreateDanceModalProps {
  isOpen: boolean
  onClose: () => void
  editDance?: Dance | null
  mode?: 'create' | 'edit'
}

export function CreateDanceModal({
  isOpen,
  onClose,
  editDance = null,
  mode = 'create'
}: CreateDanceModalProps) {
  const { useCreateDance, useUpdateDance } = useDance()
  const createDanceMutation = useCreateDance()
  const updateDanceMutation = useUpdateDance()
  const { useGetAllRobotModels } = useRobotModel()

  const { data: robotModels } = useGetAllRobotModels()
  const isEditMode = mode === 'edit' && editDance

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DanceModal>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      duration: 60,
      status: 1,
      icon: "",
      robotModelId: "",
      type: 1,
    }
  })

  useEffect(() => {
    if (isEditMode && editDance) {
      reset({
        code: editDance.code,
        name: editDance.name,
        description: editDance.description,
        duration: editDance.duration,
        status: editDance.status,
        icon: editDance.icon,
        robotModelId: editDance.robotModelId || "",
        type: editDance.type || 1,
      })
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        duration: 60,
        status: 1,
        icon: "",
        robotModelId: "",
        type: 1,
      })
    }
  }, [editDance, isEditMode, reset])

  const status = watch("status")
  const type = watch("type")

  const onSubmit = async (data: DanceModal) => {
    try {
      if (isEditMode && editDance) {
        await updateDanceMutation.mutateAsync({ id: editDance.id, data })
        toast.success('Thành công')
      } else {
        await createDanceMutation.mutateAsync(data)
        toast.success('Thành công')
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving dance:", error)
      toast.error('Có lỗi xảy ra')
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
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? 'Chỉnh sửa điệu nhảy' : 'Tạo điệu nhảy mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin điệu nhảy.'
              : 'Nhập thông tin để tạo điệu nhảy mới.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Mẫu robot */}
          <div className="space-y-2">
            <Label htmlFor="robotModelId" className="text-sm font-medium">
              Mẫu robot *
            </Label>
            <Select
              value={watch("robotModelId")}
              onValueChange={(value) => setValue("robotModelId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mẫu robot" />
              </SelectTrigger>
              <SelectContent>
                {robotModels?.data?.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.robotModelId && (
              <p className="text-sm text-red-500">{errors.robotModelId.message}</p>
            )}
          </div>

          {/* Mã điệu nhảy */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã điệu nhảy *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: 'Vui lòng nhập mã điệu nhảy',
                minLength: { value: 2, message: 'Mã điệu nhảy phải có ít nhất 2 ký tự' }
              })}
              placeholder="Nhập mã điệu nhảy"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          {/* Tên điệu nhảy */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên điệu nhảy *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: 'Vui lòng nhập tên điệu nhảy',
                minLength: { value: 2, message: 'Tên điệu nhảy phải có ít nhất 2 ký tự' }
              })}
              placeholder="Nhập tên điệu nhảy"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Mô tả
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Nhập mô tả điệu nhảy"
              rows={3}
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-sm font-medium">
              Icon
            </Label>
            <Textarea
              id="icon"
              {...register("icon")}
              placeholder="Nhập đường dẫn icon"
              rows={3}
            />
          </div>

          {/* Thời lượng */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Thời lượng (giây) *
            </Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", {
                required: 'Vui lòng nhập thời lượng',
                min: { value: 1, message: 'Thời lượng phải lớn hơn 0' },
                valueAsNumber: true
              })}
              placeholder="60"
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </Label>
            <Select
              value={status.toString()}
              onValueChange={(value) => setValue("status", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Kích hoạt
                  </span>
                </SelectItem>
                <SelectItem value="0">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Không kích hoạt
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cường độ */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Cường độ *
            </Label>
            <Select
              value={type?.toString() || "1"}
              onValueChange={(value) => setValue("type", parseInt(value))}
            >
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
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting
                ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...')
                : (isEditMode ? 'Cập nhật' : 'Tạo mới')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
