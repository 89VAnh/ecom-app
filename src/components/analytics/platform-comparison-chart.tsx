"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Dữ liệu mẫu cho biểu đồ
const data = [
    {
        name: "Điện thoại",
        TGDD: 15890000,
        FPT: 16290000,
        CPS: 15690000,
        GearVN: 16490000,
        PhongVu: 16190000,
    },
    {
        name: "Laptop",
        TGDD: 22490000,
        FPT: 22890000,
        CPS: 22990000,
        GearVN: 21990000,
        PhongVu: 22290000,
    },
    {
        name: "Âm thanh",
        TGDD: 4290000,
        FPT: 4390000,
        CPS: 4490000,
        GearVN: 4590000,
        PhongVu: 4690000,
    },
    {
        name: "Màn hình",
        TGDD: 7890000,
        FPT: 8090000,
        CPS: 8190000,
        GearVN: 7990000,
        PhongVu: 7690000,
    },
    {
        name: "Phụ kiện",
        TGDD: 1890000,
        FPT: 1790000,
        CPS: 1990000,
        GearVN: 1890000,
        PhongVu: 1990000,
    },
]

export function PlatformComparisonChart() {
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
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}tr`} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()}đ`, ""]} />
                <Legend />
                <Bar dataKey="TGDD" name="Thế Giới Di Động" fill="#3b82f6" />
                <Bar dataKey="FPT" name="FPT Shop" fill="#8b5cf6" />
                <Bar dataKey="CPS" name="CellphoneS" fill="#ec4899" />
                <Bar dataKey="GearVN" name="GearVN" fill="#f97316" />
                <Bar dataKey="PhongVu" name="Phong Vũ" fill="#10b981" />
            </BarChart>
        </ResponsiveContainer>
    )
}
