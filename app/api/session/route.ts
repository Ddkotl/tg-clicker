import {
  errorSessionResponseSchema,
  SessionErrorResponseType,
  sessionResponseSchema,
  SessionResponseType,
} from "@/entities/auth";
import { AppJWTPayload, getSession } from "@/entities/auth/_vm/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session: AppJWTPayload | null = await getSession();

    if (!session) {
      const response = { data: {}, message: "No active session" };
      errorSessionResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }

    const response: SessionResponseType = {
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
    const response: SessionErrorResponseType = {
      data: {},
      message: "Internal server error",
    };
    errorSessionResponseSchema.parse(response);
    return NextResponse.json(response, { status: 500 });
  }
}
