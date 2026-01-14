"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExtendedAction } from "@/types/extended-action"
import { AlertTriangle } from "lucide-react"


interface DeleteExtendedActionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    extended_action: ExtendedAction | null
    isDeleting?: boolean
}

export function DeleteExtendedActionModal({
    isOpen,
    onClose,
    onConfirm,
    extended_action,
    isDeleting = false
}: DeleteExtendedActionModalProps) {
    if (!extended_action) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Xóa hành động nâng cao
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        Bạn có chắc chắn muốn xóa hành động nâng cao này không?
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{extended_action.id}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Tên hành động nâng cao:</span>
                        <span className="ml-2 text-gray-900">{extended_action.name}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
