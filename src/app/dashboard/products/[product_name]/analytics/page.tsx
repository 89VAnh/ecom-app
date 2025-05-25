"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LineChart, BarChart3, Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useHistories } from "@/hooks/useHistories"
import { useEffect } from "react"
import { useProducts } from "@/hooks/useProducts"
import { formatVND, roundTo } from "@/lib/utils"
import { Product } from "@/services/products"
import { PriceHistoryChart } from "@/components/products/price-history-chart"

export default function ProductDetailPage() {
    const queryString = useParams().product_name as string
    const { histories, productName, setProductName } = useHistories()
    const { products, setSearchParams } = useProducts()
    useEffect(() => {
        const decoded = decodeURIComponent(queryString);
        const productNameEncoded = decoded.split('=')[1];
        const productName = productNameEncoded.replace(/\+/g, ' ');
        if (productName) {
            setProductName(productName)
            setSearchParams({ name: productName })
        }
    }, [queryString, setProductName, setSearchParams])

    return (
        <div className="space-y-6">
            <Tabs defaultValue="price-history" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="price-history" className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Lịch sử giá
                    </TabsTrigger>
                    <TabsTrigger value="platform-comparison" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        So sánh giữa các sàn
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="price-history" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biến động giá theo thời gian</CardTitle>
                            <CardDescription>Theo dõi sự thay đổi giá của {productName} trong 12 tháng qua</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="h-[400px]">
                                {histories.length > 0 ? <PriceHistoryChart data={histories.map(x => ({ date: x.crawled_at.toString(), price: x.price, platform_id: x.platform_id, platform: x.platform }))} /> : <span>{histories.length + " " + productName}</span>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="platform-comparison" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>So sánh giữa các sàn thương mại</CardTitle>
                            <CardDescription>
                                So sánh giá, đánh giá và lượt mua của {histories[0]?.title} trên các sàn thương mại điện tử
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sàn thương mại</TableHead>
                                            <TableHead className="text-right">Giá bán</TableHead>
                                            <TableHead className="text-right">Đánh giá</TableHead>
                                            <TableHead className="text-right">Số lượt đánh giá</TableHead>
                                            <TableHead className="text-right">Lượt mua</TableHead>
                                            <TableHead className="text-right">Chênh lệch giá</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.map((product: Product, index: number) => {
                                            const platform = product.platform
                                            const priceDiff = product.highestPrice - product.lowestPrice
                                            const priceDiffPercent = roundTo((priceDiff / product.lowestPrice) * 100, 2)

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <div className="font-medium">{platform}</div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">{formatVND(product.currentPrice)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end">
                                                            <span className="mr-1">{product.rating}</span>
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">{product.reviews}</TableCell>
                                                    <TableCell className="text-right">{product.purchase_count ?? 0}</TableCell>
                                                    <TableCell className="text-right">
                                                        {product.currentPrice === product.lowestPrice ? (
                                                            <Badge variant="success">Giá tốt nhất</Badge>
                                                        ) : (
                                                            <span className="text-red-500">
                                                                +{priceDiff.toLocaleString()}đ (+{priceDiffPercent}%)
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
