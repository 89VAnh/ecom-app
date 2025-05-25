"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bot, Plus, Play, Pause, Settings, Trash2, Clock, Store, AlertCircle, Search } from "lucide-react"
import { AddCrawlerDialog } from "@/components/crawlers/add-crawler-dialog"
import { EditCrawlerDialog } from "@/components/crawlers/edit-crawler-dialog"
import { DeleteCrawlerDialog } from "@/components/crawlers/delete-crawler-dialog"
import { useCrawlers } from "@/hooks/useCrawlers"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Crawler } from "@/services/crawlers"
import { useProducts } from "@/hooks/useProducts"
import { formatDate } from "@/lib/utils"

const status_dict = {
    "active": { "title": "Đang hoạt động", "color": "bg-blue-500" },
    "paused": { "title": "Tạm dừng", "color": "bg-yellow-500" },
    "error": { "title": "Lỗi", "color": "bg-red-500" },
    "success": { "title": "Thành công", "color": "bg-green-500" },
}

export default function CrawlersPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCrawler, setSelectedCrawler] = useState<Crawler | null>(null)
    const { total: productsTotal } = useProducts()
    const { crawlers, setPatternName, addCrawler, editCrawler, removeCrawler } = useCrawlers()
    const { platforms } = usePlatforms()

    // Xử lý sửa crawler
    const handleEditCrawler = (updatedCrawler: Partial<Crawler>) => {
        editCrawler(selectedCrawler!.crawler_id, updatedCrawler)
        setIsEditDialogOpen(false)
    }

    // Xử lý xóa crawler
    const handleDeleteCrawler = () => {
        removeCrawler(selectedCrawler!.crawler_id)
        setIsDeleteDialogOpen(false)
    }

    const handleToggleStatus = (crawlerId: number) => {
        const crawler = crawlers.find((crawler) => crawler.platform_id === crawlerId)
        if (crawler) {
            const updatedCrawler: Crawler = {
                ...crawler,
                metadata: JSON.stringify(crawler.metadata),
                status: crawler.status === "active" ? "paused" : "active",
            }
            editCrawler(crawler.crawler_id, updatedCrawler)
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bộ thu thập dữ liệu</h1>
                    <p className="text-muted-foreground">Quản lý các bộ thu thập dữ liệu tự động</p>
                </div>
                <Button
                    className="hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm bộ thu thập
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách bộ thu thập</CardTitle>
                    <CardDescription>Quản lý và giám sát các bộ thu thập dữ liệu từ các sàn thương mại điện tử</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm bộ thu thập..."
                                className="pl-8"
                                onChange={(e) => setPatternName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên bộ thu thập</TableHead>
                                    <TableHead>Sàn</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Lần chạy cuối</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {crawlers.map((crawler) => (
                                    <TableRow key={crawler.crawler_id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Bot className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium">{crawler.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" >
                                                <Store className="h-3 w-3 mr-1" />
                                                {crawler.platform}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge

                                                className={"capitalize " + status_dict[crawler.status]?.color}
                                            >
                                                {status_dict[crawler.status].title}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                                <span>{formatDate(crawler.last_run)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-1">
                                                {crawler.status === "active" ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 cursor-pointer hover:bg-amber-50 text-amber-600"
                                                        onClick={() => handleToggleStatus(crawler.platform_id)}
                                                    >
                                                        <Pause className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 cursor-pointer hover:bg-green-50 text-green-600"
                                                        onClick={() => handleToggleStatus(crawler.platform_id)}
                                                    >
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-50 text-blue-600"
                                                    onClick={() => {
                                                        setSelectedCrawler(crawler)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 text-red-600"
                                                    onClick={() => {
                                                        setSelectedCrawler(crawler)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Thống kê thu thập</CardTitle>
                    <CardDescription>Tổng quan về dữ liệu đã thu thập được</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                                <Bot className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{productsTotal}</div>
                                <p className="text-xs text-muted-foreground">Sản phẩm đã thu thập</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Thu thập hôm nay</CardTitle>
                                <Bot className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{crawlers.filter(x => new Date(x.last_run).toDateString() === new Date().toDateString()).length}</div>
                                <p className="text-xs text-muted-foreground">Số bộ thu thập chạy trong hôm nay</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Bộ thu thập hoạt động</CardTitle>
                                <Bot className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{crawlers.filter(x => x.status === "active").length}/{crawlers.length}</div>
                                <p className="text-xs text-muted-foreground">Bộ thu thập đang hoạt động</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Lỗi thu thập</CardTitle>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{crawlers.filter(x => x.status === "error").length}</div>
                                <p className="text-xs text-muted-foreground">Bộ thu thập đang gặp lỗi</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog thêm bộ thu thập */}
            <AddCrawlerDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onAdd={addCrawler}
                platforms={platforms}
            />

            {/* Dialog sửa bộ thu thập */}
            {selectedCrawler && (
                <EditCrawlerDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    crawler={selectedCrawler}
                    onSave={handleEditCrawler}
                    platforms={platforms}
                />
            )}

            {/* Dialog xóa bộ thu thập */}
            {selectedCrawler && (
                <DeleteCrawlerDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    crawler={selectedCrawler}
                    onDelete={handleDeleteCrawler}
                />
            )}
        </div>
    )
}
