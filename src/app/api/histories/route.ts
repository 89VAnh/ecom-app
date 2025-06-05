import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  search: z
    .object({
      product_name: z.string().optional(),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
    })
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const rawQuery = {
      search: searchParams.get("search")
        ? JSON.parse(searchParams.get("search") as string)
        : undefined,
    };
    const { search } = QuerySchema.parse(rawQuery);

    const product_name = search?.product_name;

    let query =
      "SELECT h.*, p.name as platform FROM histories h INNER JOIN platforms p ON h.platform_id = p.platform_id";
    const conditions = ["h.title = $1"];
    const values = [product_name];
    if (search?.fromDate) {
      conditions.push(`DATE(crawled_at) >= DATE($${values.length + 1})`);
      values.push(search.fromDate);
    }
    if (search?.toDate) {
      conditions.push(`DATE(crawled_at) <= DATE($${values.length + 1})`);
      values.push(search.toDate);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY h.crawled_at DESC";
    console.log("Query:", query);
    console.log("Values:", values);
    const result = await pool.query(query, values);

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
