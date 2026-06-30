import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

/**
 * Public routes – requests matching these patterns bypass JWT verification.
 * Everything else under /api/ requires a valid auth_token cookie.
 */
const PUBLIC_PATTERNS: Array<{ methods: string[]; pattern: RegExp }> = [
  // Auth endpoints are always public
  { methods: ["GET", "POST", "DELETE", "HEAD"], pattern: /^\/api\/auth\// },
  // Public read access to blogs (list + single)
  { methods: ["GET", "HEAD"], pattern: /^\/api\/blogs(\/[^/]+)?$/ },
  // Public read access to reviews
  { methods: ["GET", "HEAD"], pattern: /^\/api\/reviews$/ },
  // Public read access to gallery
  { methods: ["GET", "HEAD"], pattern: /^\/api\/gallery$/ },
  // Public contact form submission
  { methods: ["POST"], pattern: /^\/api\/contact$/ },
];

function isPublic(method: string, pathname: string): boolean {
  return PUBLIC_PATTERNS.some(
    (r) => r.methods.includes(method) && r.pattern.test(pathname)
  );
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Only process API routes
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  // Allow public routes through without checking auth
  if (isPublic(method, pathname)) return NextResponse.next();

  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    console.error("[MIDDLEWARE] No token found in cookies for", pathname);
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please login to continue.",
      },
      { status: 401 }
    );
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    console.error("[MIDDLEWARE] Token verification failed for", pathname, error);
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token. Please login again.",
      },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
