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
import { getAllRobotModels } from "@/features/robots/api/robot-model-api"
import { useExtendedActions } from "@/features/activities/hooks/use-extended-actions"
import { ExtendedActionModal, ExtendedAction } from "@/types/extended-action"
import { useEffect, useState } from "react"
import { toast } from "sonner"


interface CreateExtendedActionModalProps {
  isOpen: boolean
  onClose: () => void
  editExtendedAction?: ExtendedAction | null
  mode?: 'create' | 'edit'
}

export function CreateExtendedActionModal({
  isOpen,
  onClose,
  editExtendedAction = null,
  mode = 'create'
}: CreateExtendedActionModalProps) {
  // Đã loại bỏ i18n, chỉ dùng tiếng Việt
  const { useCreateExtendedAction, useUpdateExtendedAction } = useExtendedActions()
  const createExtendedActionMutation = useCreateExtendedAction()
  const updateExtendedActionMutation = useUpdateExtendedAction()

  // State for robot models
  const [robotModels, setRobotModels] = useState<{ id: string; name: string }[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [modelsError, setModelsError] = useState<string | null>(null)

  const isEditMode = mode === 'edit' && editExtendedAction

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ExtendedActionModal>({
    defaultValues: {
      code: "",
      name: "",
      icon: "",
      status: 1,
      robotModelId: "",
    }
  })


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

  
  useEffect(() => {
    if (isEditMode && editExtendedAction) {
      reset({
        code: editExtendedAction.code,
        name: editExtendedAction.name,
        icon: editExtendedAction.icon,
        status: editExtendedAction.status,
        robotModelId: editExtendedAction.robotModelId,
      })
    } else {
      reset({
        code: "",
        name: "",
        icon: "",
        status: 1,
        robotModelId: "",
      })
    }
  }, [editExtendedAction, isEditMode, reset])

  const status = watch("status")
  const robotModelId = watch("robotModelId")

  const onSubmit = async (data: ExtendedActionModal) => {
  try {
    const submitData = { ...data, robotModelId }

    if (isEditMode && editExtendedAction) {
      await updateExtendedActionMutation.mutateAsync({
        id: editExtendedAction.id,
        actionData: submitData,
      })
      toast.success("Cập nhật biểu cảm thành công!")
    } else {
      await createExtendedActionMutation.mutateAsync(submitData)
      toast.success("Tạo biểu cảm thành công!")
    }

    reset()
    onClose()
  } catch (error) {
    console.error("Error saving ExtendedAction:", error)
    toast.error(
      isEditMode
        ? "Cập nhật thất bại. Vui lòng thử lại."
        : "Tạo mới thất bại. Vui lòng thử lại."
    )
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
              id="icon"
              type="string"
              {...register("icon", {
              })}
              placeholder="Nhập đường dẫn hình ảnh"
              className={errors.icon ? "border-red-500" : ""}
            />
            {errors.icon && (
              <p className="text-sm text-red-500">{errors.icon.message}</p>
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
