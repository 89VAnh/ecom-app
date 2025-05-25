import { NextResponse } from 'next/server'
import { z } from 'zod'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'

const accountSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    role: z.enum(["admin", "user"]),
})

export async function GET() {
    try {
        const result = await pool.query(
            'SELECT account_id, username, role, created_at FROM accounts ORDER BY created_at DESC'
        )

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

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = accountSchema.parse(body)

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        const result = await pool.query(
            'INSERT INTO accounts (username, password, role) VALUES ($1, $2, $3) RETURNING account_id, username, role, created_at',
            [validatedData.username, hashedPassword, validatedData.role]
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

        // Type guard for PostgreSQL error
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({
                    success: false,
                    error: "Tên đăng nhập đã tồn tại"
                }, { status: 400 })
            }
        }

        console.error('Database error:', error)
        return NextResponse.json({
            success: false,
            error: "Lỗi khi tạo tài khoản"
        }, { status: 500 })
    }
} 