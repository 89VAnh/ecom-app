import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";

const crawlerUpdateSchema = z.object({
  name: z.string(),
  platform_id: z.number().int(),
  metadata: z.string(),
  status: z.enum(["active", "error", "paused"]),
  last_run: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await pool.query(
      "SELECT crawler_id, name, platform_id, metadata, status, last_run FROM crawlers WHERE crawler_id = $1",
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

async function startCrawler(crawlerId: number, metadata: string) {
  console.log("Crawler is active, calling Python FastAPI service...");
  const body = {
    metadata: metadata,
    crawlerId: crawlerId,
  };

  // Call the Python FastAPI service
  await fetch("http://playwright-python:5000/run-crawler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log("Crawler execution triggered");
}

async function stopCrawler(crawlerId: number) {
  console.log("Crawler is paused, stopping execution...");
  const url = `http://playwright-python:5000/stop-crawler/${crawlerId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.detail || "Failed to stop crawler" },
      { status: response.status }
    );
  }
  console.log("Crawler execution stopped");
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const validatedData = crawlerUpdateSchema.parse(body);
    const crawlerId = Number((await params).id);

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (validatedData.name) {
      updates.push(`name = $${paramCount}`);
      values.push(validatedData.name);
      paramCount++;
    }
    if (validatedData.platform_id) {
      updates.push(`platform_id = $${paramCount}`);
      values.push(validatedData.platform_id);
      paramCount++;
    }
    if (validatedData.metadata) {
      updates.push(`metadata = $${paramCount}`);
      values.push(validatedData.metadata);
      paramCount++;
    }
    if (validatedData.status) {
      updates.push(`status = $${paramCount}`);
      values.push(validatedData.status);
      paramCount++;
    }

    values.push(crawlerId);

    const updateQuery = `
        WITH updated AS (
            UPDATE crawlers 
            SET ${updates.join(", ")} 
            WHERE crawler_id = $${paramCount}
            RETURNING *
        )
        SELECT updated.*, platforms.name AS platform
        FROM updated
        JOIN platforms ON updated.platform_id = platforms.platform_id;
    `;
    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy crawler",
        },
        { status: 404 }
      );
    }

    if (validatedData.status == "active") {
      startCrawler(crawlerId, JSON.parse(validatedData.metadata));
    } else if (validatedData.status == "paused") {
      stopCrawler(crawlerId);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "23505"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Crawler đã tồn tại",
        },
        { status: 400 }
      );
    }

    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi khi cập nhật crawler",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await pool.query(
      "DELETE FROM crawlers WHERE crawler_id = $1 RETURNING crawler_id",
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

    stopCrawler(Number((await params).id));

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();

    const updateQuery = `
        WITH updated AS (
            UPDATE crawlers 
            SET status = $1
            WHERE crawler_id = $2
            RETURNING crawler_id, name, platform_id, metadata, status
        )
        SELECT updated.*, platforms.name AS platform
        FROM updated
        JOIN platforms ON updated.platform_id = platforms.platform_id;
    `;

    const result = await pool.query(updateQuery, [
      body.status,
      Number((await params).id),
    ]);

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
