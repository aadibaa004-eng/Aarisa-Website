import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { createContactSchema } from "@/validations/contact";
import { sendContactEmail } from "@/lib/resend";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/utils/response";
import type { PaginationMeta } from "@/types";

// POST /api/contact — Public — submit contact form
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.errors.map((e) => e.message));
    }

    const contact = await Contact.create(parsed.data);

    // Fire-and-forget email notification – do not block the response
    sendContactEmail(parsed.data).catch((err: unknown) => {
      console.error("[Resend] Failed to send contact notification:", err);
    });

    return successResponse(
      { id: contact._id.toString() },
      "Thank you! We will get back to you shortly.",
      201
    );
  } catch {
    return errorResponse("Failed to submit contact form");
  }
}

// GET /api/contact — Protected — list all contact submissions
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
    );
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (status && ["new", "contacted", "closed"].includes(status)) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [total, contacts] = await Promise.all([
      Contact.countDocuments(query),
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    return successResponse(
      { contacts, pagination },
      "Contact forms retrieved successfully"
    );
  } catch {
    return errorResponse("Failed to retrieve contact forms");
  }
}
