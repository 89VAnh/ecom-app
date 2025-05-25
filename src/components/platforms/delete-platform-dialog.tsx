"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Platform } from "@/services/platforms"

interface DeletePlatformDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    platform: Platform | null
    onDelete: () => void
}

export function DeletePlatformDialog({ open, onOpenChange, platform, onDelete }: DeletePlatformDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ xóa sàn thương mại &quot;{platform?.name}&quot; và không thể hoàn tác. Tất cả dữ liệu liên quan đến
                        sàn này cũng có thể bị ảnh hưởng.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                        Xóa
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
