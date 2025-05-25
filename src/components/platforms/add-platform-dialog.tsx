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
import Image from "next/image"
import { Platform } from "@/services/platforms"
interface AddPlatformDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (platform: Partial<Platform>) => void
}

export function AddPlatformDialog({ open, onOpenChange, onAdd }: AddPlatformDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        logo: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd(formData)
        setFormData({
            name: "",
            url: "",
            logo: "",
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Thêm sàn thương mại mới</DialogTitle>
                        <DialogDescription>Nhập thông tin sàn thương mại điện tử để thêm vào hệ thống.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Tên sàn
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input
                                id="url"
                                name="url"
                                type="url"
                                value={formData.url}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                                placeholder="https://"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="logo" className="text-right">
                                Logo URL
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <Input
                                    id="logo"
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
                            Thêm sàn thương mại
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
