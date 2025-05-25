"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Dữ liệu mẫu cho biểu đồ
const data = [
    { name: "Điện thoại", value: 342, color: "#3b82f6" },
    { name: "Phụ kiện", value: 389, color: "#6366f1" },
    { name: "Laptop", value: 215, color: "#8b5cf6" },
    { name: "Âm thanh", value: 178, color: "#ec4899" },
    { name: "Màn hình", value: 124, color: "#f97316" },
]

export function CategoryDistributionChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} sản phẩm`, ""]} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}
