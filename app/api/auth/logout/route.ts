import { NextResponse } from "next/server";
import { successResponse } from "@/utils/response";

export async function POST(): Promise<NextResponse> {
  const response = successResponse(null, "Logged out successfully");

  // Clear the auth cookie by setting maxAge to 0
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
