import { AppJWTPayload, getSession } from "@/entities/auth/_vm/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const sessionResponseSchema = z.object({
  data: z.object({
    user: z.object({
      telegram_id: z.string(),
      userId: z.string(),
    }),
    exp: z.number(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type SessionErrorResponse = z.infer<typeof errorResponseSchema>;

export async function GET() {
  try {
    const session: AppJWTPayload | null = await getSession();

    if (!session) {
      const response = { data: {}, message: "No active session" };
      errorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }

    const response: SessionResponse = {
      data: {
        user: session.user,
        exp: session.exp ?? 0,
      },
      message: "ok",
    };
    sessionResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /session error:", error);
    const response: SessionErrorResponse = {
      data: {},
      message: "Internal server error",
    };
    errorResponseSchema.parse(response);
    return NextResponse.json(response, { status: 500 });
  }
}
