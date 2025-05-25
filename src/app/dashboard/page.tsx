"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Store,
    Bot,
} from "lucide-react"
import { useCrawlers } from "@/hooks/useCrawlers"
import { useProducts } from "@/hooks/useProducts"
import { usePlatforms } from "@/hooks/usePlatforms"
import { formatVND } from "@/lib/utils"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { DateRange } from "react-day-picker"
export default function DashboardPage() {
    const { crawlers } = useCrawlers()
    const { platforms } = usePlatforms()
    const { products, total: productTotals, loading: productLoading, setSearchParams: setSearchTop } = useProducts({ initialPageSize: 5 })
    const { products: lastProducts, setSearchParams: setSearchLast } = useProducts({ initialPageSize: 5, priceChangeOrder: "DESC" })

    const handleDateChange = (date: DateRange | undefined) => {
        if (date?.from && date?.to) {
            setSearchTop((prev) => ({
                ...prev,
                fromDate: date.from ? date.from.toISOString() : undefined,
                toDate: date.to ? date.to.toISOString() : undefined,
            }));
            setSearchLast((prev) => ({
                ...prev,
                fromDate: date.from ? date.from.toISOString() : undefined,
                toDate: date.to ? date.to.toISOString() : undefined,
            }));
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Phân tích thị trường</h1>
                <p className="text-muted-foreground">Theo dõi biến động giá và xu hướng thị trường</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sản phẩm theo dõi</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productTotals}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bộ thu thập</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{crawlers.length}</div>
                        <div className="flex items-center space-x-2 text-xs">
                            <span className="flex items-center text-blue-500">
                                <Bot className="mr-1 h-3 w-3" />
                                {crawlers.filter(x => x.status != "paused").length}/{crawlers.length}
                            </span>
                            <span className="text-muted-foreground">bộ thu thập đang hoạt động</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sàn thương mại</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{platforms.length}</div>
                        <div className="flex items-center space-x-2 text-xs">
                            <span className="flex items-center text-green-500">
                                <Store className="mr-1 h-3 w-3" />
                                {platforms.length}/{platforms.length}
                            </span>
                            <span className="text-muted-foreground">sàn đang hoạt động</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="price-changes" className="space-y-4">
                <div className="flex justify-between">

                    <TabsList>
                        <TabsTrigger value="price-changes" className="cursor-pointer hover:bg-gray-100 transition-colors">
                            Biến động giá
                        </TabsTrigger>
                    </TabsList>
                    <DatePickerWithRange onDateChange={handleDateChange} />
                </div>

                <TabsContent value="price-changes" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Giảm giá nhiều nhất</CardTitle>
                                <CardDescription>Sản phẩm có mức giảm giá cao nhất trong 7 ngày qua</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">

                                    {!productLoading && products.map(x => <div className="space-y-4" key={x.name}>
                                        <div className="flex items-center">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{x.name}</p>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span>{x.platform}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end">
                                                    <p className="text-sm font-medium mr-2">{formatVND(x.currentPrice)}</p>
                                                    <TrendingDown className="h-4 w-4 text-green-500" />
                                                </div>
                                                <p className="text-xs text-green-500">{x.priceChange}</p>
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tăng giá nhiều nhất</CardTitle>
                                <CardDescription>Sản phẩm có mức tăng giá cao nhất trong 7 ngày qua</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {lastProducts.map(product => <div key={product.name} className="flex items-center">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{product.name}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <span>{product.platform}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end">
                                                <p className="text-sm font-medium mr-2">{formatVND(product.currentPrice)}</p>
                                                <TrendingUp className="h-4 w-4 text-red-500" />
                                            </div>
                                            <p className="text-xs text-red-500">{product.priceChange}%</p>
                                        </div>
                                    </div>)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
