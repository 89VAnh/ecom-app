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
import { Account } from "@/services/accounts"

interface DeleteAccountDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    account: Partial<Account> | null
    onDelete: () => void
}

export function DeleteAccountDialog({ open, onOpenChange, account, onDelete }: DeleteAccountDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Hành động này sẽ xóa tài khoản {account?.username} và không thể hoàn tác. Tất cả dữ liệu liên quan đến tài
                        khoản này cũng có thể bị ảnh hưởng.
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
