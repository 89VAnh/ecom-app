import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";

const crawlerSchema = z.object({
  name: z.string(),
  platform_id: z.number().int(),
  metadata: z.string(),
  status: z.enum(["active", "error", "paused"]),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const namePattern = searchParams.get("name") || "";
    const result = await pool.query(
      "SELECT crawler_id, c.name, c.platform_id, p.name  as platform, metadata, status, last_run FROM crawlers c INNER JOIN platforms p ON c.platform_id = p.platform_id WHERE c.name ILIKE $1 ORDER BY last_run DESC;",
      [`%${namePattern}%`]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = crawlerSchema.parse(body);

    if (validatedData.status == "active") {
      console.log("Crawler is active, calling Python FastAPI service...");
      try {
        const body = { pipeline: validatedData.metadata };

        // Call the Python FastAPI service
        const response = await fetch("http://localhost:5000/run-crawler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.detail || "Crawler failed" },
            { status: response.status }
          );
        }

        const result = await response.json();
        return NextResponse.json(
          { message: "Crawler executed successfully", result },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            error: "Invalid request or crawler execution failed",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400 }
        );
      }
    }

    const result = await pool.query(
      `
      WITH inserted AS (
        INSERT INTO crawlers (name, platform_id, metadata, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      )
      SELECT inserted.*, platforms.name AS platform
      FROM inserted
      JOIN platforms ON inserted.platform_id = platforms.platform_id;
      `,
      [
        validatedData.name,
        validatedData.platform_id,
        validatedData.metadata,
        validatedData.status,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
      },
      { status: 201 }
    );
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

    // Type guard for PostgreSQL error
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === "23505") {
        // Unique violation
        return NextResponse.json(
          {
            success: false,
            error: "Tên đăng nhập đã tồn tại",
          },
          { status: 400 }
        );
      }
    }

    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi tạo tài khoản",
      },
      { status: 500 }
    );
  }
}
