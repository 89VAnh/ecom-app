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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Platform } from "@/services/platforms"
import { Textarea } from "../ui/textarea"
import { Crawler } from "@/services/crawlers"

interface EditCrawlerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    crawler: Crawler
    onSave: (crawler: Partial<Crawler>) => void
    platforms: Platform[]
}

export function EditCrawlerDialog({ open, onOpenChange, crawler, onSave, platforms }: EditCrawlerDialogProps) {
    const [formData, setFormData] = useState<Partial<Crawler>>({
        crawler_id: crawler?.crawler_id,
        name: crawler?.name || "",
        platform_id: crawler?.platform_id,
        platform: crawler?.platform,
        status: crawler?.status || "active",
        metadata: crawler?.metadata || "",
    })

    useEffect(() => {
        if (crawler) {
            setFormData({
                crawler_id: crawler.crawler_id,
                name: crawler.name,
                platform_id: crawler.platform_id,
                status: crawler.status,
                metadata: JSON.stringify(crawler.metadata),
            })
        }
    }, [crawler])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePlatformChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            platform_id: Number(value),
            platform: platforms.find((p) => p.platform_id === Number(value))?.name || "",
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
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
                        <DialogTitle>Chỉnh sửa bộ thu thập</DialogTitle>
                        <DialogDescription>Cập nhật thông tin bộ thu thập dữ liệu.</DialogDescription>
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
                            <Select value={formData?.platform_id?.toString()} onValueChange={handlePlatformChange} required>
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
                            <Label htmlFor="metadata" className="text-right">
                                Metadata
                            </Label>
                            <Textarea
                                id="metadata"
                                name="metadata"
                                value={formData.metadata}
                                onChange={handleMetadataChange}
                                className="col-span-3"
                                required
                            />
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
