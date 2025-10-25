import { FactCoutNocheckErrorResponseType, factCoutNocheckResponseSchema, getFactNocheckCount } from "@/entities/facts";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return makeError("Missing userId", 400);
    }

    const result = await getFactNocheckCount(userId);
    if (result === null || result === undefined) {
      return makeError("Failed to fetch user facts", 500);
    }

    const response: FactCoutNocheckErrorResponseType = {
      data: result,
      message: "Facts count fetched successfully",
    };

    factCoutNocheckResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /facts error:", error);
    return makeError("Internal server error", 500);
  }
}
