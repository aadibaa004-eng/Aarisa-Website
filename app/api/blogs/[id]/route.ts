import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { updateBlogSchema } from "@/validations/blog";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/utils/response";

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/blogs/:id
 * Public — accepts either a MongoDB ObjectId OR a slug string.
 * If the param is a valid ObjectId, look up by _id; otherwise look up by slug.
 */
export async function GET(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    const blog = mongoose.isValidObjectId(id)
      ? await Blog.findOne({ _id: id, published: true })
      : await Blog.findOne({ slug: id, published: true });

    if (!blog) {
      return notFoundResponse("Blog not found");
    }

    return successResponse(blog, "Blog retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve blog");
  }
}

/**
 * PUT /api/blogs/:id
 * Protected — updates a blog by its MongoDB ObjectId.
 * If the title changes, the pre-save hook regenerates the slug automatically.
 */
export async function PUT(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse("Invalid blog ID", 400);
    }

    const body = await request.json();
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    // Use .save() so the pre-save slug generation hook fires on title change
    const blog = await Blog.findById(id);
    if (!blog) return notFoundResponse("Blog not found");

    Object.assign(blog, parsed.data);
    await blog.save();

    return successResponse(blog, "Blog updated successfully");
  } catch {
    return errorResponse("Failed to update blog");
  }
}

/**
 * DELETE /api/blogs/:id
 * Protected — deletes a blog by its MongoDB ObjectId.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse("Invalid blog ID", 400);
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return notFoundResponse("Blog not found");
    }

    return successResponse(null, "Blog deleted successfully");
  } catch {
    return errorResponse("Failed to delete blog");
  }
}
