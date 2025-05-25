"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Dữ liệu mẫu cho biểu đồ
const data = [
    { month: "T1", smartphone: -2.1, laptop: -1.5, tablet: -3.2, accessories: -0.8 },
    { month: "T2", smartphone: -3.5, laptop: -2.2, tablet: -4.1, accessories: -1.2 },
    { month: "T3", smartphone: -4.2, laptop: -3.1, tablet: -2.8, accessories: -1.5 },
    { month: "T4", smartphone: -5.1, laptop: -3.8, tablet: -2.2, accessories: -2.1 },
    { month: "T5", smartphone: -4.8, laptop: -4.2, tablet: -1.8, accessories: -2.5 },
    { month: "T6", smartphone: -3.9, laptop: -3.5, tablet: -1.2, accessories: -1.8 },
    { month: "T7", smartphone: -2.8, laptop: -2.2, tablet: -0.8, accessories: -1.2 },
    { month: "T8", smartphone: -1.5, laptop: -1.8, tablet: 0.5, accessories: -0.5 },
    { month: "T9", smartphone: -0.8, laptop: -1.2, tablet: 1.2, accessories: 0.2 },
    { month: "T10", smartphone: -1.2, laptop: -0.8, tablet: 0.8, accessories: 0.5 },
    { month: "T11", smartphone: -2.5, laptop: -1.5, tablet: 0.2, accessories: 0.8 },
    { month: "T12", smartphone: -3.8, laptop: -2.2, tablet: -0.5, accessories: 0.3 },
]

export function PriceAnalyticsChart() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[-6, 2]} />
                <Tooltip formatter={(value) => [`${value}%`, ""]} labelFormatter={(label) => `Tháng ${label.substring(1)}`} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="smartphone"
                    name="Điện thoại"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="laptop" name="Laptop" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="tablet" name="Máy tính bảng" stroke="#ec4899" strokeWidth={2} />
                <Line type="monotone" dataKey="accessories" name="Phụ kiện" stroke="#f97316" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    )
}
