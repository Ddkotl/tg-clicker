import { AppJWTPayload, getSession } from "@/utils/session";
import { NextResponse } from "next/server";
import { z } from "zod";

export type SessionResponse =
  | { isAuthenticated: true; session: AppJWTPayload }
  | { isAuthenticated: false };

const sessionResponseSchema = z.union([
  z.object({
    isAuthenticated: z.literal(true),
    session: z.object({
      user: z.object({ telegram_id: z.string() }),
      expires: z.string(),
    }),
  }),
  z.object({
    isAuthenticated: z.literal(false),
  }),
]);

export async function GET() {
  const session: AppJWTPayload | null = await getSession();
  if (session) {
    const response = { isAuthenticated: true, session: session };
    sessionResponseSchema.parse(response);
    return NextResponse.json(response);
  } else {
    const response = { isAuthenticated: false };
    sessionResponseSchema.parse(response);
    return NextResponse.json(response, { status: 401 });
  }
}
