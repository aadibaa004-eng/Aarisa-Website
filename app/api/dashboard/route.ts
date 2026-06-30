import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Review from "@/models/Review";
import Gallery from "@/models/Gallery";
import Contact from "@/models/Contact";
import { successResponse, errorResponse } from "@/utils/response";

// GET /api/dashboard — Protected
export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    const [
      totalBlogs,
      totalReviews,
      totalGallery,
      totalContacts,
      newContacts,
      latestContacts,
      latestBlogs,
    ] = await Promise.all([
      Blog.countDocuments(),
      Review.countDocuments(),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: "new" }),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Blog.find().sort({ createdAt: -1 }).limit(5).select("-content"),
    ]);

    return successResponse(
      {
        stats: {
          totalBlogs,
          totalReviews,
          totalGallery,
          totalContacts,
          newContacts,
        },
        latestContacts,
        latestBlogs,
      },
      "Dashboard data retrieved successfully"
    );
  } catch {
    return errorResponse("Failed to retrieve dashboard data");
  }
}
