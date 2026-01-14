"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"
import { RobotApk } from "@/types/robot-apk"
import { useCreateRobotApk, useUpdateRobotApk } from "@/features/apks/hooks/use-robot-apk"
import { useRobotModel } from "@/features/robots/hooks/use-robot-model"
import ReactQuillProps from "react-quill-new"
import ReactQuill from "react-quill-new"
import { RobotModel } from "@/types/robot-model"

// Tải trình soạn thảo 1 lần ở module scope để tránh re-mount gây nháy trắng
const ReactQuillDynamic = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[180px] rounded-md bg-muted animate-pulse" />
})

  export function ApkModal({ isOpen, onClose, editApk, onSuccess }: { isOpen: boolean, onClose: () => void, editApk: RobotApk | null, onSuccess: () => void }) {
  const isEditMode = !!editApk
  const [name, setName] = useState("")
  const [version, setVersion] = useState("")
  const [description, setDescription] = useState("")
  const [robotModelId, setRobotModelId] = useState("")
  const [isRequireLicense, setIsRequireLicense] = useState(false)
  const [status, setStatus] = useState<number>(1)
  const [file, setFile] = useState<File | undefined>(undefined)

  const { useGetAllRobotModels } = useRobotModel()
  const { data: robotModelsResp } = useGetAllRobotModels()
  const robotModels = useMemo(() => robotModelsResp?.data ?? [], [robotModelsResp?.data])

  const createMutation = useCreateRobotApk()
  const updateMutation = useUpdateRobotApk()

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editApk) {
        setName(editApk.name || "")
        setVersion(editApk.version || "")
        setDescription(editApk.description || "")
        setRobotModelId(editApk.robotModelId || "")
        setIsRequireLicense(!!editApk.isRequireLicense)
        setStatus(editApk.status ?? 1)
        setFile(undefined)
      } else {
        setName("")
        setVersion("")
        setDescription("")
        setRobotModelId("")
        setIsRequireLicense(false)
        setStatus(1)
        setFile(undefined)
      }
    }
  }, [isOpen, isEditMode, editApk])

  const handleSubmit = async () => {
    if (!name || !version || !robotModelId) return

    if (isEditMode && editApk) {
      try {
        await updateMutation.mutateAsync({
          apkId: editApk.id,
          robotApk: {
            name,
            version,
            description,
            robotModelId,
            isRequireLicense: isIsRequireLicenseField(),
            status
          },
          file // Có thể undefined - chỉ cập nhật metadata nếu không có file
        })
        onSuccess()
      } catch (error) {
        console.error("Lỗi cập nhật APK:", error)
        // Error sẽ được handle bởi mutation
      }
      return
    }

    // Tạo mới: bắt buộc phải có file
    if (!file) {
      toast.error("Vui lòng chọn tệp ZIP để tải lên")
      return
    }

    try {
      await createMutation.mutateAsync({
        robotApk: {
          name,
          version,
          description,
          robotModelId,
          isRequireLicense: isIsRequireLicenseField(),
          file
        },
        file
      })
      onSuccess()
    } catch (error) {
      console.error("Lỗi tạo APK:", error)
      // Error sẽ được handle bởi mutation
    }
  }

  const isIsRequireLicenseField = () => {
    // types differ between UI state (boolean) and DTO naming
    return isRequireLicense
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Cập nhật APK" : "Tải lên APK mới"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Tên APK</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="vd: Ứng dụng điều khiển robot" />
          </div>

          <div className="grid gap-2">
            <Label>Phiên bản</Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="vd: 1.2.3" />
          </div>

          <div className="grid gap-2">
            <Label>Mô tả</Label>
            <div className="min-h-[200px]">
              <ReactQuill theme="snow" value={description} onChange={setDescription} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Robot Model</Label>
            <select
              className="border rounded-md h-9 px-3"
              value={robotModelId}
              onChange={(e) => setRobotModelId(e.target.value)}
            >
              <option value="">-- Chọn model --</option>
              {robotModels.map((m: RobotModel) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input id="isRequireLicense" type="checkbox" checked={isRequireLicense} onChange={(e) => setIsRequireLicense(e.target.checked)} />
            <Label htmlFor="isRequireLicense">Yêu cầu license</Label>
          </div>

          {isEditMode && (
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <Select value={status.toString()} onValueChange={(value) => setStatus(parseInt(value))}>
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
          )}

          <div className="grid gap-2">
            <Label>Tệp ZIP {!isEditMode && <span className="text-red-500">*</span>}</Label>
            <Input type="file" accept=".zip,application/zip" onChange={(e) => setFile(e.target.files?.[0])} />
            {isEditMode && (
              <>
                {file && (
                  <p className="text-xs text-blue-600">
                    ✓ Đã chọn tệp mới: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {file 
                    ? "Sẽ cập nhật cả thông tin và tệp ZIP mới."
                    : "Để trống nếu chỉ muốn cập nhật thông tin (phiên bản, mô tả, model, license)."}
                </p>
              </>
            )}
            {!isEditMode && (
              <p className="text-xs text-muted-foreground">Bắt buộc: chọn tệp .zip để tải lên</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Hủy</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || (!isEditMode && !file) || !name || !version || !robotModelId}
          >
            {isLoading 
              ? (isEditMode ? "Đang cập nhật..." : "Đang tải lên...")
              : (isEditMode 
                  ? (file ? "Cập nhật thông tin & tệp" : "Cập nhật thông tin")
                  : "Tải lên")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


