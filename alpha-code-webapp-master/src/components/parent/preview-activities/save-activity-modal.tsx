import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

interface SaveActivityModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  activityName: string
  onActivityNameChange: (name: string) => void
  onSave: () => void
  isSaving: boolean
  fileName?: string
  timeRange?: string
}

export function SaveActivityModal({
  isOpen,
  onOpenChange,
  activityName,
  onActivityNameChange,
  onSave,
  isSaving,
  fileName,
  timeRange
}: SaveActivityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Lưu Hành Động
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="activityName">Tên Hành Động</Label>
            <Input
              id="activityName"
              placeholder="Nhập tên cho activity..."
              value={activityName}
              onChange={(e) => onActivityNameChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          {fileName && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>File nguồn:</strong> {fileName}
              {timeRange && (
                <>
                  <br />
                  <strong>Thời gian:</strong> {timeRange}
                </>
              )}
            </div>
          )}
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              onClick={onSave}
              disabled={!activityName.trim() || isSaving}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : ( 
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Activity
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}