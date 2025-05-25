import { NextResponse } from 'next/server'
import { z } from 'zod'
import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

const loginSchema = z.object({
    username: z.string(),
    password: z.string()
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = loginSchema.parse(body)

        // Check user exists
        const result = await pool.query(
            'SELECT account_id, username, password, role FROM accounts WHERE username = $1',
            [validatedData.username]
        )

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                error: "Tên đăng nhập hoặc mật khẩu không đúng"
            }, { status: 401 })
        }

        const user = result.rows[0]

        // Verify password
        const validPassword = await bcrypt.compare(validatedData.password, user.password)
        if (!validPassword) {
            return NextResponse.json({
                success: false,
                error: "Tên đăng nhập hoặc mật khẩu không đúng"
            }, { status: 401 })
        }

        // Create JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new SignJWT({
            account_id: user.account_id,
            username: user.username,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret)

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        })

        return NextResponse.json({
            success: true,
            data: {
                account_id: user.account_id,
                username: user.username,
                role: user.role
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({
            success: false,
            error: "Lỗi đăng nhập"
        }, { status: 500 })
    }
} 