import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { createReviewSchema } from "@/validations/review";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/utils/response";

// GET /api/reviews — Public — returns only approved reviews
export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const reviews = await Review.find({ approved: true }).sort({
      createdAt: -1,
    });

    return successResponse(reviews, "Reviews retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve reviews");
  }
}

// POST /api/reviews — Protected (middleware handles auth)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const review = await Review.create(parsed.data);

    return successResponse(review, "Review created successfully", 201);
  } catch {
    return errorResponse("Failed to create review");
  }
}
