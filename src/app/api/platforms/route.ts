import { NextResponse } from 'next/server'
import { z } from 'zod'
import pool from '@/lib/db'

// Schema validation for platform
const platformSchema = z.object({
    name: z.string().min(2, "Tên sàn phải có ít nhất 2 ký tự"),
    url: z.string().url("URL không hợp lệ"),
    logo: z.string(),
})

// GET /api/platforms - Lấy danh sách sàn
export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM platforms')

        return NextResponse.json({
            success: true,
            data: result.rows
        })
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({
            success: false,
            error: "Lỗi khi truy vấn cơ sở dữ liệu"
        }, { status: 500 })
    }
}

// POST /api/platforms - Tạo sàn mới
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = platformSchema.parse(body)

        const result = await pool.query(
            'INSERT INTO platforms (name, url, logo) VALUES ($1, $2, $3) RETURNING *',
            [validatedData.name, validatedData.url, validatedData.logo]
        )

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                error: error.errors
            }, { status: 400 })
        }

        console.error('Database error:', error)
        return NextResponse.json({
            success: false,
            error: "Lỗi khi thêm sàn mới"
        }, { status: 500 })
    }
} 