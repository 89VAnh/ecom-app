"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Account } from "@/services/accounts"

interface AddAccountDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (account: Account) => void
}

export function AddAccountDialog({ open, onOpenChange, onAdd }: AddAccountDialogProps) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "user",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd(formData as Account)
        setFormData({
            username: "",
            password: "",
            role: "user",
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Thêm tài khoản mới</DialogTitle>
                        <DialogDescription>Nhập thông tin tài khoản để thêm vào hệ thống.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Tên đăng nhập
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Mật khẩu
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Vai trò
                            </Label>
                            <Select value={formData.role} onValueChange={handleRoleChange} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Quản trị viên</SelectItem>
                                    <SelectItem value="user">Người dùng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Thêm tài khoản
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
