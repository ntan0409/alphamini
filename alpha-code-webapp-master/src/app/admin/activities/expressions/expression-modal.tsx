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
import { useExpression } from "@/features/activities/hooks/use-expression"
import { ExpressionModal, Expression } from "@/types/expression"
import { useEffect } from "react"
import { toast } from "sonner"
import { useRobotModel } from "@/features/robots/hooks/use-robot-model"

interface CreateExpressionModalProps {
  isOpen: boolean
  onClose: () => void
  editExpression?: Expression | null
  mode?: 'create' | 'edit'
}

export function CreateExpressionModal({
  isOpen,
  onClose,
  editExpression = null,
  mode = 'create'
}: CreateExpressionModalProps) {
  const { useCreateExpression, useUpdateExpression } = useExpression()
  const createExpressionMutation = useCreateExpression()
  const updateExpressionMutation = useUpdateExpression()
  const { useGetAllRobotModels } = useRobotModel()
  const { data: robotModels } = useGetAllRobotModels()

  const isEditMode = mode === 'edit' && editExpression

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ExpressionModal>({
    defaultValues: {
      code: "",
      name: "",
      imageUrl: "",
      status: 1,
      robotModelId: "",
    }
  })

  useEffect(() => {
    if (isEditMode && editExpression) {
      reset({
        code: editExpression.code,
        name: editExpression.name,
        imageUrl: editExpression.imageUrl,
        status: editExpression.status,
        robotModelId: editExpression.robotModelId || "",
      })
    } else {
      reset({
        code: "",
        name: "",
        imageUrl: "",
        status: 1,
        robotModelId: "",
      })
    }
  }, [editExpression, isEditMode, reset])

  const status = watch("status")

  const onSubmit = async (data: ExpressionModal) => {
    try {
      if (isEditMode && editExpression) {
        await updateExpressionMutation.mutateAsync({ id: editExpression.id, data })
        toast.success("Cập nhật biểu cảm thành công!")
      } else {
        await createExpressionMutation.mutateAsync(data)
        toast.success("Tạo biểu cảm thành công!")
      }
      reset()
      onClose()
    } catch (error) {
      console.error("Error saving expression:", error)
      toast.error(isEditMode ? 'Cập nhật thất bại. Vui lòng thử lại.' : 'Tạo mới thất bại. Vui lòng thử lại.')
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
            {isEditMode ? 'Chỉnh sửa biểu cảm' : 'Tạo biểu cảm mới'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Cập nhật thông tin biểu cảm.'
              : 'Nhập thông tin để tạo biểu cảm mới.'
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

          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Mã biểu cảm *
            </Label>
            <Input
              id="code"
              {...register("code", {
                required: 'Vui lòng nhập mã biểu cảm',
                minLength: { value: 2, message: 'Mã biểu cảm phải có ít nhất 2 ký tự' }
              })}
              placeholder="Nhập mã biểu cảm"
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Tên biểu cảm *
            </Label>
            <Input
              id="name"
              {...register("name", {
                required: 'Vui lòng nhập tên biểu cảm',
                minLength: { value: 2, message: 'Tên biểu cảm phải có ít nhất 2 ký tự' }
              })}
              placeholder="Nhập tên biểu cảm"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">
              Đường dẫn hình ảnh (URL)
            </Label>
            <Input
              id="imageUrl"
              type="url"
              {...register("imageUrl", {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'URL không hợp lệ'
                }
              })}
              placeholder="Nhập đường dẫn hình ảnh"
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

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
