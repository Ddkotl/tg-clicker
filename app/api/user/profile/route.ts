import { Fraktion, Gender } from "@/_generated/prisma";
import { getUserProfileByUserId } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const profileResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    nikname: z.string().nullable(),
    fraktion: z.enum(Fraktion).nullable(),
    gender: z.enum(Gender).nullable(),
    color_theme: z.string().nullable(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfileErrorResponse = z.infer<typeof errorResponseSchema>;

export async function GET(req: NextRequest) {
  try {
    const session: AppJWTPayload | null = await getSession();
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    let userIdToFetch: string | null = null;

    if (requestedUserId) {
      userIdToFetch = requestedUserId;
    } else if (session) {
      userIdToFetch = session.user.userId;
    }

    if (!userIdToFetch) {
      const response: ProfileErrorResponse = {
        data: {},
        message: "User not authenticated",
      };
      errorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }

    const profile = await getUserProfileByUserId(userIdToFetch);
    if (!profile || !profile.profile) {
      return NextResponse.json(
        { data: {}, message: "User not found" },
        { status: 404 },
      );
    }

    const response: ProfileResponse = {
      data: {
        userId: profile.profile.userId,
        nikname: profile.profile.nikname,
        fraktion: profile.profile.fraktion,
        gender: profile.profile.gender,
        color_theme: profile.profile.color_theme,
      },
      message: "Profile fetched successfully",
    };

    profileResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /user/profile error:", error);
    const response: ProfileErrorResponse = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
