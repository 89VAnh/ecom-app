"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Platform } from "@/services/platforms"
import Image from "next/image"
interface EditPlatformDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    platform: Platform | null
    onSave: (platform: Partial<Platform>) => void
}

export function EditPlatformDialog({ open, onOpenChange, platform, onSave }: EditPlatformDialogProps) {
    const [formData, setFormData] = useState({
        platform_id: platform?.platform_id,
        name: platform?.name || "",
        url: platform?.url || "",
        logo: platform?.logo || "",
    })

    useEffect(() => {
        if (platform) {
            setFormData({
                platform_id: platform.platform_id,
                name: platform.name,
                url: platform.url,
                logo: platform.logo,
            })
        }
    }, [platform])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa sàn thương mại</DialogTitle>
                        <DialogDescription>Cập nhật thông tin sàn thương mại điện tử.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Tên sàn
                            </Label>
                            <Input
                                id="edit-name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-url" className="text-right">
                                URL
                            </Label>
                            <Input
                                id="edit-url"
                                name="url"
                                type="url"
                                value={formData.url}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-logo" className="text-right">
                                Logo URL
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <Input
                                    id="edit-logo"
                                    name="logo"
                                    type="url"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="https://"
                                />
                                {formData.logo && (
                                    <div className="mt-2">
                                        <Image
                                            src={formData.logo}
                                            alt="Logo preview"
                                            className="object-contain border rounded-md"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = ""
                                            }}
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
