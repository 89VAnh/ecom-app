import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const product_name = searchParams.get("product_name");
    const result = await pool.query(
      "SELECT h.*, p.name as platform FROM histories h INNER JOIN platforms p ON h.platform_id = p.platform_id WHERE h.title = $1 ORDER BY h.crawled_at",
      [product_name]
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
