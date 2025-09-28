import { getUserByTgId } from "@/repositories/user_repository";
import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const userResponseSchema = z.object({
  user: z.object({
    telegram_id: z.string(),
    username: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    language_code: z.string().nullable(),
  }),
});

const unauthenticatedResponseSchema = z.object({
  isAuthenticated: z.literal(false),
});

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    const user = await getUserByTgId(session.user.telegram_id);
    if (user) {
      const response = { user: user };
      userResponseSchema.parse(response);
      return NextResponse.json(response);
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
