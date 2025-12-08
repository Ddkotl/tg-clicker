import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/entities/user/_repositories/user_repository";

const querySchema = z.object({
  userId: z.string(),
});

const referralResponseSchema = z.object({
  data: z.object({
    referrals: z.array(z.string()),
    referrer: z.string().nullable(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export type ReferralResponse = z.infer<typeof referralResponseSchema>;
export type ReferralErrorResponse = z.infer<typeof errorResponseSchema>;

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const parsed = querySchema.safeParse({ userId });

    if (!parsed.success) {
      const errorResponse: ReferralErrorResponse = {
        data: {},
        message: "Missing or invalid userId",
      };
      errorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    const referrals = await userRepository.getReferrals({ userId: parsed.data.userId });
    const referrerData = await userRepository.getReferer({ userId: parsed.data.userId });
    const referrer = referrerData?.referrerId || null;

    const response: ReferralResponse = {
      data: {
        referrals: referrals.map((ref) => ref.id),
        referrer,
      },
      message: "ok",
    };
    referralResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /referrals error:", error);

    const errorResponse: ReferralErrorResponse = {
      data: {},
      message: "Internal server error",
    };
    errorResponseSchema.parse(errorResponse);
    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}
