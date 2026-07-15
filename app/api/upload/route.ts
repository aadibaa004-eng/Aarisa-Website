import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/utils/response";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/upload — Protected (middleware handles auth)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return errorResponse("No image file provided. Use field name 'image'.", 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse(
        "Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF.",
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("Image size cannot exceed 5 MB.", 400);
    }

    console.log(`📤 Uploading image: ${file.name} (${file.size} bytes, ${file.type})`);

    // Convert File → base64 data URI for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    console.log(`📤 Base64 conversion done, uploading to Cloudinary...`);
    const { url: imageUrl, publicId } = await uploadImage(base64);

    console.log(`✅ Upload successful: ${imageUrl}`);
    return successResponse({ imageUrl, publicId }, "Image uploaded successfully", 201);
  } catch (error) {
    console.error("❌ Upload error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return errorResponse(`Failed to upload image: ${errorMsg}`);
  }
}
