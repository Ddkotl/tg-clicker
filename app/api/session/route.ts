import {
  errorSessionResponseSchema,
  SessionErrorResponseType,
  sessionResponseSchema,
  SessionResponseType,
} from "@/entities/auth";
import {
  AppJWTPayload,
  getSession,
  updateSession,
} from "@/entities/auth/_vm/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session: AppJWTPayload | null = await getSession();

    if (!session) {
      const response = { data: {}, message: "No active session" };
      errorSessionResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }
    const updated_session = await updateSession(request);
    if (!updated_session) {
      const response = { data: {}, message: "No updated_session" };
      errorSessionResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }
    const response: SessionResponseType = {
      data: {
        user: updated_session?.user,
        exp: updated_session.exp ?? 0,
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
