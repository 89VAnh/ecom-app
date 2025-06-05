"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useHistories } from "@/hooks/useHistories"
import { useEffect, useState } from "react"
import { PriceHistoryChart } from "@/components/products/price-history-chart"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { DateRange } from "react-day-picker"

export default function ProductDetailPage() {
    const queryString = useParams().product_name as string
    const { histories, setSearch } = useHistories()
    const [productName, setProductName] = useState<string>("")
    useEffect(() => {
        const decoded = decodeURIComponent(queryString);
        const productNameEncoded = decoded.split('=')[1];
        const productName = productNameEncoded.replace(/\+/g, ' ');
        if (productName) {
            setSearch({ product_name: productName })
            setProductName(productName)
        }
    }, [queryString, setProductName, setSearch])

    const handleDateChange = (date: DateRange | undefined) => {
        if (date?.from && date?.to) {
            setSearch((prev) => ({
                ...prev,
                fromDate: date.from ? date.from.toISOString() : undefined,
                toDate: date.to ? date.to.toISOString() : undefined,
            }));

        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <CardTitle className="-l">Biến động giá theo thời gian</CardTitle>
                            <CardDescription>Theo dõi sự thay đổi giá của {productName}</CardDescription>
                        </div>
                        <DatePickerWithRange onDateChange={handleDateChange} />
                    </div>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="h-[400px]">
                        {<PriceHistoryChart data={histories.map(x => ({ date: x.crawled_at.toString(), price: x.price, platform_id: x.platform_id, platform: x.platform }))} />}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
