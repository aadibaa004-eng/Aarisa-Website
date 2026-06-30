import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Gallery from "@/models/Gallery";
import { updateGallerySchema } from "@/validations/gallery";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/utils/response";

type Params = { params: Promise<{ id: string }> };

// PUT /api/gallery/:id — Protected
export async function PUT(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse("Invalid gallery item ID", 400);
    }

    const body = await request.json();
    const parsed = updateGallerySchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const item = await Gallery.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return notFoundResponse("Gallery item not found");
    }

    return successResponse(item, "Gallery item updated successfully");
  } catch {
    return errorResponse("Failed to update gallery item");
  }
}

// DELETE /api/gallery/:id — Protected
export async function DELETE(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse("Invalid gallery item ID", 400);
    }

    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return notFoundResponse("Gallery item not found");
    }

    return successResponse(null, "Gallery item deleted successfully");
  } catch {
    return errorResponse("Failed to delete gallery item");
  }
}
