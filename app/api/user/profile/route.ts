import { getUserProfileByTgId } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileResponseSchema = z.object({
  profile: z.object({
    userId: z.string(),
    nikname: z.string().nullable(),
    fraktion: z.string().nullable(),
    gender: z.string().nullable(),
    color_theme: z.string().nullable(),
  }),
});

const unauthenticatedResponseSchema = z.object({
  isAuthenticated: z.literal(false),
});

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    const profile = await getUserProfileByTgId(session.user.telegram_id);
    if (profile) {
      profileResponseSchema.parse(profile);
      return NextResponse.json(profile);
    } else {
      const response = { isAuthenticated: false };
      unauthenticatedResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }
  } else {
    const response = { isAuthenticated: false };
    unauthenticatedResponseSchema.parse(response);
    return NextResponse.json(response, { status: 401 });
  }
}
