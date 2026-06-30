import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/validations/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/utils/response";
import { checkRateLimit } from "@/utils/rateLimit";

// 5 attempts per 15 minutes per IP
const LOGIN_RATE_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting – keyed by client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rl = checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT);
  if (!rl.allowed) {
    return errorResponse(
      "Too many login attempts. Please try again in 15 minutes.",
      429
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const { email, password } = parsed.data;

    await connectDB();

    // Select password explicitly (field has select: false)
    const admin = await Admin.findOne({ email }).select("+password");

    // Use constant-time comparison path to prevent user enumeration
    if (!admin || !(await admin.comparePassword(password))) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = await signToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    const isProduction = process.env.NODE_ENV === "production";

    const response = successResponse(
      { id: admin._id.toString(), email: admin.email },
      "Login successful"
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return errorResponse("An error occurred during login");
  }
}
