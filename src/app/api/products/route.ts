import { z } from "zod";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/platforms - Lấy danh sách sàn
const QuerySchema = z.object({
  pageIndex: z.number().int().default(0),
  pageSize: z.number().int().default(10),
  search: z
    .object({
      name: z.string().optional(),
      platform_id: z.number().int().optional(),
      priceChangeOrder: z.string().optional(),
      fromDate: z.string().optional(),
      toDate: z.string().optional(),
    })
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const rawQuery = {
      pageIndex: Number(searchParams.get("pageIndex") ?? 0),
      pageSize: Number(searchParams.get("pageSize") ?? 12),
      search: searchParams.get("search")
        ? JSON.parse(searchParams.get("search") as string)
        : undefined,
    };
    const { pageIndex, pageSize, search } = QuerySchema.parse(rawQuery);

    const offset = pageIndex * pageSize;

    let query = "SELECT * FROM products";
    const values = [];
    const conditions: string[] = [];

    if (search?.name) {
      conditions.push(`name ILIKE $${values.length + 1}`);
      values.push(`%${search.name}%`);
    }
    if (search?.platform_id) {
      conditions.push(`platform_id = $${values.length + 1}`);
      values.push(search.platform_id);
    }
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
    const pagination_query =
      query +
      ` ORDER BY "priceChange" ${
        search?.priceChangeOrder || ""
      } OFFSET ${offset} LIMIT ${pageSize}`;
    console.log(pagination_query, values);
    const { rows } = await pool.query(pagination_query, values);
    const countQuery = query.replace(
      /SELECT \* FROM/,
      "SELECT COUNT(*) AS count FROM"
    );

    const {
      rows: [{ count }],
    } = await pool.query(countQuery, values);

    return NextResponse.json(
      {
        products: rows,
        total: parseInt(count),
        pageIndex,
        pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
