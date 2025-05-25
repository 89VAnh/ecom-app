import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

const accountUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .optional(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional(),
  role: z.enum(["admin", "user"]).optional(),
});

// GET handler
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await pool.query(
      "SELECT account_id, username, role, created_at FROM accounts WHERE account_id = $1",
      [Number((await params).id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy tài khoản",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi truy vấn cơ sở dữ liệu",
      },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = accountUpdateSchema.parse(body);
    const accountId = Number((await params).id);

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (validatedData.username) {
      updates.push(`username = $${paramCount}`);
      values.push(validatedData.username);
      paramCount++;
    }
    if (validatedData.password) {
      updates.push(`password = $${paramCount}`);
      values.push(await bcrypt.hash(validatedData.password, 10));
      paramCount++;
    }
    if (validatedData.role) {
      updates.push(`role = $${paramCount}`);
      values.push(validatedData.role);
      paramCount++;
    }

    values.push(accountId);

    const updateQuery = `
      UPDATE accounts 
      SET ${updates.join(", ")} 
      WHERE account_id = $${paramCount}
      RETURNING account_id, username, role, created_at
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy tài khoản",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors,
        },
        { status: 400 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Tên đăng nhập đã tồn tại",
        },
        { status: 400 }
      );
    }

    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi cập nhật tài khoản",
      },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await pool.query(
      "DELETE FROM accounts WHERE account_id = $1 RETURNING account_id",
      [Number((await params).id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy tài khoản",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa tài khoản thành công",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi xóa tài khoản",
      },
      { status: 500 }
    );
  }
}
