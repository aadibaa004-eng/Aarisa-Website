import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { createBlogSchema } from "@/validations/blog";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/utils/response";
import type { PaginationMeta } from "@/types";

// GET /api/blogs — Public (but returns drafts if authenticated)
// Query params: page, limit, category, search
// Returns all blogs if admin is logged in, otherwise only published blogs
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Check if user is authenticated (has auth token)
    const isAuthenticated = !!request.cookies.get("auth_token")?.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    // Only filter by published if user is not authenticated
    if (!isAuthenticated) {
      query.published = true;
    }

    if (category) {
      // Case-insensitive exact match on category
      query.category = { $regex: new RegExp(`^${escapeRegex(category)}$`, "i") };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-content"), // Omit heavy content field from list view
    ]);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    return successResponse({ blogs, pagination }, "Blogs retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve blogs");
  }
}

// POST /api/blogs — Protected (middleware handles auth)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = createBlogSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const blog = await Blog.create(parsed.data);

    return successResponse(blog, "Blog created successfully", 201);
  } catch (err: unknown) {
    if (isDuplicateKeyError(err)) {
      return errorResponse("A blog with this title already exists", 409);
    }
    return errorResponse("Failed to create blog");
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    err instanceof Error &&
    "code" in err &&
    (err as NodeJS.ErrnoException).code === "11000"
  );
}
