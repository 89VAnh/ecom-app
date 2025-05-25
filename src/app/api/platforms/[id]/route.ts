import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";

// Schema validation for platform update
const platformUpdateSchema = z.object({
  name: z.string().min(2, "Tên sàn phải có ít nhất 2 ký tự").optional(),
  url: z.string().url("URL không hợp lệ").optional(),
  logo: z.string().optional(),
});

// GET /api/platforms/[id] - Lấy thông tin một sàn
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await pool.query(
      "SELECT * FROM platforms WHERE platform_id = $1",
      [Number((await params).id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy sàn",
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

// PUT /api/platforms/[id] - Cập nhật thông tin sàn
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = platformUpdateSchema.parse(body);
    const platform_id = Number((await params).id);

    // Build the update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (validatedData.name) {
      updates.push(`name = $${paramCount}`);
      values.push(validatedData.name);
      paramCount++;
    }
    if (validatedData.url) {
      updates.push(`url = $${paramCount}`);
      values.push(validatedData.url);
      paramCount++;
    }
    if (validatedData.logo) {
      updates.push(`logo = $${paramCount}`);
      values.push(validatedData.logo);
      paramCount++;
    }

    values.push(platform_id);

    const updateQuery = `
            UPDATE platforms 
            SET ${updates.join(", ")} 
            WHERE platform_id = $${paramCount}
            RETURNING *
        `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy sàn",
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

    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi cập nhật sàn",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/platforms/[id] - Xóa sàn
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await pool.query(
      "DELETE FROM platforms WHERE platform_id = $1 RETURNING *",
      [Number((await params).id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy sàn",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa sàn thành công",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi xóa sàn",
      },
      { status: 500 }
    );
  }
}
