"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { formatVND } from "@/lib/utils"


// Define the input and output interfaces
interface InputRecord {
    date: string;
    price: number;
    platform: string;
    platform_id: number;
}
interface PriceHistoryChartProps {
    data: InputRecord[]
}

interface OutputRecord {
    date: string;
    [platform: string]: number | string; // Allow string for date and numbers for platform prices
}

function transformData(input: InputRecord[]): OutputRecord[] {
    const groupedByDate: { [date: string]: InputRecord[] } = input.reduce((acc, record) => {
        if (!acc[record.date]) {
            acc[record.date] = [];
        }
        acc[record.date].push(record);
        return acc;
    }, {} as { [date: string]: InputRecord[] });

    const result: OutputRecord[] = Object.keys(groupedByDate).map(date => {
        const output: OutputRecord = { date };
        groupedByDate[date].forEach(record => {
            output[record?.platform_id?.toString()] = record.price;
        });
        return output;
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
}

function getPlatformList(input: InputRecord[]): number[] {
    const uniquePlatforms = Array.from(new Set(input.map(record => record.platform_id)));
    return uniquePlatforms
}
const line_colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316"]

export function PriceHistoryChart({ data }: PriceHistoryChartProps) {
    const output = transformData(data)
    const platfrom_list = getPlatformList(data)
    const chartData = output.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" }),
    }))

    // Tìm giá thấp nhất và cao nhất để hiển thị trên biểu đồ
    const minPrice = Math.min(...data.map((item) => item.price))
    const maxPrice = Math.max(...data.map((item) => item.price))

    // Tính toán domain cho trục Y để có khoảng cách phù hợp
    const yDomainMin = Math.floor(minPrice * 0.95)
    const yDomainMax = Math.ceil(maxPrice * 1.05)

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}tr`}
                    domain={[yDomainMin, yDomainMax]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <Card className="p-2 border shadow-sm bg-white">
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-sm text-muted-foreground">Giá: {formatVND(payload[0].value as number)}</p>
                                </Card>
                            )
                        }
                        return null
                    }}
                />

                {platfrom_list.map((platform, index: number) =>
                    <Line
                        type="monotone"
                        key={platform}
                        dataKey={platform}
                        stroke={line_colors[index]}
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    )
}
