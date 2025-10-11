import { Fraktion, Gender } from "@/_generated/prisma";
import { getUserProfileByUserId } from "@/entities/auth/_repositories/user_repository";
import { AppJWTPayload, getSession } from "@/shared/utils/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const ProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fraktion: z.enum(Fraktion).nullable(),
  nikname: z.string().nullable(),
  gender: z.enum(Gender).nullable(),
  color_theme: z.string().nullable(),
  avatar_url: z.string().nullable(),
  player_motto: z.string().nullable(),
  lvl: z.number(),
  exp: z.number(),
  mana: z.number(),
  gold: z.number(),
  diamond: z.number(),
  fight: z.number(),
  last_fight_time: z.date().nullable(),
  glory: z.number(),
  power: z.number(),
  protection: z.number(),
  speed: z.number(),
  skill: z.number(),
  qi: z.number(),
  current_hitpoint: z.number(),
  max_hitpoint: z.number(),
});
const profileResponseSchema = z.object({
  data: ProfileSchema.nullable(),
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
        ...profile.profile,
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
