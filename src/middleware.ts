import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Các đường dẫn không cần xác thực
const publicPaths = ["/auth", "/api/auth/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép truy cập các đường dẫn công khai
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Lấy token từ cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Kiểm tra quyền truy cập trang admin
    if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Thêm thông tin user vào headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.account_id as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // Token không hợp lệ hoặc hết hạn
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

// Chỉ định các đường dẫn cần middleware xử lý
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
    "/dashboard/:path*",
  ],
};
