"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, LineChart, Store } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useProducts } from "@/hooks/useProducts"
import { usePlatforms } from "@/hooks/usePlatforms"
import { formatVND } from "@/lib/utils"

export default function ProductsPage() {
    const { products, total, pageIndex, pageSize, searchParams, loading, setPageIndex, setSearchParams, fetchProducts } = useProducts()
    const { platforms } = usePlatforms()
    const totalPages = Math.ceil(total / pageSize)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Sản phẩm</h1>
                <p className="text-muted-foreground">Quản lý và theo dõi sản phẩm từ các sàn thương mại điện tử</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách sản phẩm theo dõi</CardTitle>
                    <CardDescription>Bạn đang theo dõi {total} sản phẩm từ các sàn thương mại điện tử</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-1 w-full space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm theo tên ..."
                                    className="pl-8 w-full"
                                    value={searchParams?.name}
                                    onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}

                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Select onValueChange={(value: string) => setSearchParams({ ...searchParams, platform_id: value })} defaultValue={searchParams?.platform_id || "all"}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Chọn sàn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả sàn</SelectItem>
                                    {
                                        platforms.map((platform) => (
                                            <SelectItem key={platform.platform_id} value={platform.platform_id.toString()}>
                                                <div className="flex items-center">
                                                    <Image
                                                        src={platform.logo}
                                                        alt={platform.name}
                                                        width={24}
                                                        height={24}
                                                        className="mr-2"
                                                    />
                                                    {platform.name}
                                                </div>
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="cursor-pointer hover:bg-gray-100 transition-all duration-200" onClick={fetchProducts}>
                                <Filter className="h-4 w-4 mr-2" />
                                Lọc
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Đang tải...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products?.map((product) => (
                                    <Card key={`${product.name}-${product.platform}`} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                                        <div className="aspect-square w-full bg-gray-100 flex items-center justify-center relative">
                                            <Image src={product.image} alt={product.name} fill={true} />
                                        </div>
                                        <CardContent className="flex-1 flex flex-col p-4">
                                            <div className="flex-1">
                                                <Link href={product.link}>
                                                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">{product.name}</h3>
                                                </Link>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                <Badge variant="outline" className="flex items-center">
                                                    <Store className="h-3 w-3 mr-1" />
                                                    {product.platform}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-lg">{formatVND(product.currentPrice)}</span>
                                                <span
                                                    className={`flex items-center text-sm ${product.priceChange < 0 ? "text-green-500" : "text-red-500"
                                                        }`}
                                                >
                                                    {product.priceChange < 0 ? "↓" : "↑"} {Math.abs(product.priceChange)}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-amber-500">
                                                    {product.rating} ★ ({product.reviews})
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {formatVND(product.lowestPrice)} - {formatVND(product.highestPrice)}
                                                </span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="px-4 pt-0 flex justify-end items-end">
                                            <Link href={`/dashboard/products/${new URLSearchParams({ product_name: product.name })
                                                }/analytics`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="cursor-pointer hover:bg-blue-50 text-blue-600 transition-all duration-200"
                                                >
                                                    <LineChart className="h-4 w-4 mr-1" />
                                                    Phân tích
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {products?.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
                                </div>
                            )}

                            {total > 0 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <Button
                                        disabled={pageIndex === 0 || loading}
                                        onClick={() => setPageIndex(pageIndex - 1)}
                                        variant="outline"
                                    >
                                        Trang trước
                                    </Button>
                                    <span>
                                        Trang {pageIndex + 1} / {totalPages}
                                    </span>
                                    <Button
                                        disabled={pageIndex >= totalPages - 1 || loading}
                                        onClick={() => setPageIndex(pageIndex + 1)}
                                        variant="outline"
                                    >
                                        Trang sau
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}