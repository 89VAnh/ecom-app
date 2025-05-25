"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Dữ liệu mẫu cho biểu đồ
const data = [
    { range: "Dưới 5tr", count: 342, color: "#3b82f6" },
    { range: "5-10tr", count: 289, color: "#6366f1" },
    { range: "10-20tr", count: 315, color: "#8b5cf6" },
    { range: "20-30tr", count: 178, color: "#ec4899" },
    { range: "Trên 30tr", count: 124, color: "#f97316" },
]

export function PriceRangeDistributionChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} sản phẩm`, ""]} />
                <Bar dataKey="count" name="Số lượng sản phẩm" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
