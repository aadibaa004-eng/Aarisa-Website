import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { getAdminFromRequest } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/utils/response";

export async function GET(): Promise<NextResponse> {
  try {
    const payload = await getAdminFromRequest();

    if (!payload) {
      return unauthorizedResponse();
    }

    await connectDB();

    const admin = await Admin.findById(payload.adminId).select("-password");

    if (!admin) {
      return unauthorizedResponse("Admin account not found");
    }

    return successResponse(
      {
        id: admin._id.toString(),
        email: admin.email,
        createdAt: admin.createdAt,
      },
      "Admin profile retrieved"
    );
  } catch {
    return errorResponse("Failed to retrieve admin profile");
  }
}
