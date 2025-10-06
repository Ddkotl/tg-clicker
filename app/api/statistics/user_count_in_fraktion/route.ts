import { getUserCountsInFractions } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const fractionsResponseSchema = z.object({
  data: z.object({
    adepts: z.number(),
    novices: z.number(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

// Типы
export type FractionsResponse = z.infer<typeof fractionsResponseSchema>;
export type FractionsErrorResponse = z.infer<typeof errorResponseSchema>;

export async function GET() {
  try {
    const data = await getUserCountsInFractions();

    const response: FractionsResponse = {
      data: {
        adepts: data?.adepts ?? 0,
        novices: data?.novices ?? 0,
      },
      message: "ok",
    };

    fractionsResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /statistics/user_count_in_fraktion error:", error);

    const errorResponse: FractionsErrorResponse = {
      data: {},
      message: "Internal server error",
    };

    errorResponseSchema.parse(errorResponse);

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
