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
import { Crawler } from "@/services/crawlers"

interface DeleteCrawlerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    crawler: Crawler
    onDelete: () => void
}

export function DeleteCrawlerDialog({ open, onOpenChange, crawler, onDelete }: DeleteCrawlerDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ xóa bộ thu thập &quot;{crawler?.name}&quot; và không thể hoàn tác. Tất cả dữ liệu liên quan đến bộ
                        thu thập này cũng có thể bị ảnh hưởng.
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
