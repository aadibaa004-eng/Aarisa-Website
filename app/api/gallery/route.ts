import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Gallery from "@/models/Gallery";
import { createGallerySchema } from "@/validations/gallery";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/utils/response";

// GET /api/gallery — Public
// Optional query param: type=before|after|general
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (type && ["before", "after", "general"].includes(type)) {
      query.type = type;
    }

    const gallery = await Gallery.find(query).sort({ createdAt: -1 });

    return successResponse(gallery, "Gallery retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve gallery");
  }
}

// POST /api/gallery — Protected
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    console.log("📤 Gallery POST body received:", body);

    const parsed = createGallerySchema.safeParse(body);

    if (!parsed.success) {
      console.log("❌ Validation errors:", parsed.error.errors);
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const item = await Gallery.create(parsed.data);

    return successResponse(item, "Gallery item added successfully", 201);
  } catch (error) {
    console.error("Gallery POST error:", error);
    return errorResponse(
      `Failed to add gallery item: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
