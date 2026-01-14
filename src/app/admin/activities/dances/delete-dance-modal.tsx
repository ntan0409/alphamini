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
import { Dance } from "@/types/dance"
import { AlertTriangle } from "lucide-react"


interface DeleteDanceModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    dance: Dance | null
    isDeleting?: boolean
}

export function DeleteDanceModal({
    isOpen,
    onClose,
    onConfirm,
    dance,
    isDeleting = false
}: DeleteDanceModalProps) {
    if (!dance) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Xóa điệu nhảy
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        Bạn có chắc chắn muốn xóa điệu nhảy này không?
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">ID:</span>
                        <span className="ml-2 text-gray-900">{dance.id}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Tên điệu nhảy:</span>
                        <span className="ml-2 text-gray-900">{dance.name}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Mô tả:</span>
                        <span className="ml-2 text-gray-900">{dance.description || 'Không có mô tả'}</span>
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
                        {isDeleting ? 'Đang xóa...' : 'Xóa điệu nhảy'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
