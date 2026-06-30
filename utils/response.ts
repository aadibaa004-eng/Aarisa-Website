import { NextResponse } from "next/server";

/** 200/201 success envelope */
export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200
): NextResponse {
  return NextResponse.json({ success: true, message, data }, { status });
}

/** Generic error envelope – never exposes stack traces */
export function errorResponse(
  message: string,
  status = 500,
  errors?: string[]
): NextResponse {
  return NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status }
  );
}

/** 401 */
export function unauthorizedResponse(
  message = "Unauthorized. Please login to continue."
): NextResponse {
  return errorResponse(message, 401);
}

/** 404 */
export function notFoundResponse(message = "Resource not found"): NextResponse {
  return errorResponse(message, 404);
}

/** 400 validation failure – always includes an errors array */
export function validationErrorResponse(errors: string[]): NextResponse {
  return NextResponse.json(
    { success: false, message: "Validation failed", errors },
    { status: 400 }
  );
}
