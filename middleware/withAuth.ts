import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

type RouteHandler<P = Record<string, string>> = (
  request: NextRequest,
  context: { params: Promise<P> }
) => Promise<NextResponse>;

/**
 * Higher-order function that wraps a route handler with JWT auth check.
 * Useful for routes that are partially public (e.g., GET is public, POST is not)
 * when more granular control is needed beyond the global middleware.
 */
export function withAuth<P = Record<string, string>>(
  handler: RouteHandler<P>
): RouteHandler<P> {
  return async (request, context) => {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login to continue." },
        { status: 401 }
      );
    }

    try {
      await verifyToken(token);
      return handler(request, context);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token. Please login again.",
        },
        { status: 401 }
      );
    }
  };
}
