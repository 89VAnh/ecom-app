"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Store, Settings, Trash2, ExternalLink } from "lucide-react"
import { usePlatforms } from "@/hooks/usePlatforms"
import { AddPlatformDialog } from "@/components/platforms/add-platform-dialog"
import { EditPlatformDialog } from "@/components/platforms/edit-platform-dialog"
import { DeletePlatformDialog } from "@/components/platforms/delete-platform-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Platform } from "@/services/platforms"
import Image from "next/image"

export default function PlatformsPage() {
    const { platforms, loading, addPlatform, editPlatform, removePlatform } = usePlatforms();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);


    const handleAdd = async (platform: Partial<Platform>) => {
        await addPlatform(platform);
        setIsAddDialogOpen(false);
    };

    const handleEdit = (platform: Platform) => {
        setSelectedPlatform(platform);
        setIsEditDialogOpen(true);
    };

    const handleSave = async (platform: Partial<Platform>) => {
        if (selectedPlatform) {
            await editPlatform(selectedPlatform.platform_id, platform);
            setIsEditDialogOpen(false);
            setSelectedPlatform(null);
        }
    };

    const handleDelete = (platform: Platform) => {
        setSelectedPlatform(platform);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedPlatform) {
            await removePlatform(selectedPlatform.platform_id);
            setIsDeleteDialogOpen(false);
            setSelectedPlatform(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Sàn thương mại</h1>
                    <p className="text-muted-foreground">Quản lý các sàn thương mại điện tử</p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm sàn
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách sàn thương mại</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Logo</TableHead>
                                    <TableHead>Tên sàn</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {platforms.map((platform) => (
                                    <TableRow key={platform.platform_id}>
                                        <TableCell>
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                {platform.logo ? (
                                                    <Image
                                                        src={platform.logo}
                                                        alt={platform.name}
                                                        width={24}
                                                        height={24}
                                                    />
                                                ) : (
                                                    <Store className="h-4 w-4 text-gray-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{platform.name}</TableCell>
                                        <TableCell>
                                            <a
                                                href={platform.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                {platform.url}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(platform)}
                                                    className="hover:bg-blue-50 text-blue-600"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(platform)}
                                                    className="hover:bg-red-50 text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {platforms.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Không có sàn thương mại nào
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddPlatformDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAdd={handleAdd}
            />

            <EditPlatformDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                platform={selectedPlatform}
                onSave={handleSave}
            />

            <DeletePlatformDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                platform={selectedPlatform}
                onDelete={handleConfirmDelete}
            />
        </div>
    )
}
