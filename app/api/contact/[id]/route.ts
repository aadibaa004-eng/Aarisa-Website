import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { updateContactStatusSchema } from "@/validations/contact";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/utils/response";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/contact/:id — Protected — update contact status
export async function PATCH(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse("Invalid contact ID", 400);
    }

    const body = await request.json();
    const parsed = updateContactStatusSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return notFoundResponse("Contact form not found");
    }

    return successResponse(contact, "Contact status updated successfully");
  } catch {
    return errorResponse("Failed to update contact status");
  }
}

// DELETE /api/contact/:id — Protected
export async function DELETE(
  _request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return errorResponse("Invalid contact ID", 400);
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return notFoundResponse("Contact form not found");
    }

    return successResponse(null, "Contact form deleted successfully");
  } catch {
    return errorResponse("Failed to delete contact form");
  }
}
