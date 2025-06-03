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
import { Platform } from "@/services/platforms"
import { Textarea } from "@/components/ui/textarea"

interface AddCrawlerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAdd: (crawler: any) => void
    platforms: Platform[]
}

export function AddCrawlerDialog({ open, onOpenChange, onAdd, platforms }: AddCrawlerDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        platform_id: 0,
        platform: "",
        metadata: "",
        status: "active",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePlatformChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            platform_id: Number(value),
            platform: platforms.find((platform) => platform.platform_id === Number(value))?.name || "",
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onAdd(formData)
        setFormData({
            name: "",
            platform_id: 0,
            platform: "",
            metadata: "",
            status: "active",
        })
        onOpenChange(false)
    }

    const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target
        setFormData((prev) => ({ ...prev, metadata: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Thêm bộ thu thập mới</DialogTitle>
                        <DialogDescription>Tạo bộ thu thập dữ liệu mới từ sàn thương mại điện tử.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Tên bộ thu thập
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
                            <Label htmlFor="platform" className="text-right">
                                Sàn thương mại
                            </Label>
                            <Select value={formData.platform_id.toString()} onValueChange={handlePlatformChange} required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn sàn thương mại" />
                                </SelectTrigger>
                                <SelectContent>
                                    {platforms.map((platform) => (
                                        <SelectItem key={platform.platform_id} value={platform.platform_id.toString()}>
                                            {platform.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="metadata">
                                Metadata
                            </Label>
                            <Textarea id="metadata" name="metadata" className="col-span-3 overflow-y-auto h-50" placeholder="Nhập metadata" onChange={handleMetadataChange} />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Thêm bộ thu thập
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
