import { getUserProfileByUserId } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const session: AppJWTPayload | null = await getSession();

  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId");

  // Если запросили конкретного юзера
  if (requestedUserId && session) {
    const profile = await getUserProfileByUserId(requestedUserId);
    if (profile) {
      profileResponseSchema.parse(profile);
      return NextResponse.json(profile);
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (session) {
    const profile = await getUserProfileByUserId(session.user.userId);
    if (profile) {
      profileResponseSchema.parse(profile);
      return NextResponse.json(profile);
    }
  }

  const response = { isAuthenticated: false };
  unauthenticatedResponseSchema.parse(response);
  return NextResponse.json(response, { status: 401 });
}
