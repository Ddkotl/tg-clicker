import {
  checkAllFactsErrorResponseSchema,
  CheckAllFactsErrorResponseType,
  checkAllFactsRequestSchema,
  checkAllFactsResponseSchema,
  CheckAllFactsResponseType,
} from "@/entities/facts";
import { CheckAllFacts } from "@/entities/facts/index.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = checkAllFactsRequestSchema.safeParse(body);
    if (!parsed.success) {
      const errorResponse: CheckAllFactsErrorResponseType = {
        data: {},
        message: "Invalid request data",
        type: "error",
      };
      checkAllFactsErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }
    const { userId } = parsed.data;
    const res = await CheckAllFacts(userId);
    if (!res) {
      const errorResponse: CheckAllFactsErrorResponseType = {
        data: {},
        message: "not reward",
        type: "error",
      };
      checkAllFactsErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }
    const response: CheckAllFactsResponseType = {
      data: { userId: userId },
      type: "success",
      message: "CheckAllFacts updated successfully",
    };
    checkAllFactsResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation/get_meditation_reward error:", error);
    const errorResponse: CheckAllFactsErrorResponseType = {
      data: {},
      type: "error",
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}
