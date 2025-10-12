import {
  userCountInFrErrorResponseSchema,
  UserCountInFrErrorResponseType,
  userCountInFrResponseSchema,
  UserCountInFrResponseType,
} from "@/entities/statistics";
import { getUserCountsInFractions } from "@/entities/statistics/index.server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getUserCountsInFractions();

    if (!data) {
      const errorResponse: UserCountInFrErrorResponseType = {
        data: {},
        message: "getUserCountsInFractions is null",
      };

      userCountInFrErrorResponseSchema.parse(errorResponse);

      return NextResponse.json(errorResponse, { status: 400 });
    }
    const response: UserCountInFrResponseType = {
      data: {
        adepts: data?.adepts_count ?? 0,
        novices: data?.novices_count ?? 0,
      },
      message: "ok",
    };

    userCountInFrResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /statistics/users_count_in_fr error:", error);

    const errorResponse: UserCountInFrErrorResponseType = {
      data: {},
      message: "Internal server error",
    };

    userCountInFrErrorResponseSchema.parse(errorResponse);

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
