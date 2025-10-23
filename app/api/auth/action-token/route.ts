import {
  AuthErrorResponseType,
  errorResponseSchema,
  getActionTokenResponseSchema,
  GetActionTokenResponseType,
} from "@/entities/auth";
import { createJwtActive } from "@/shared/lib/api_helpers/action_token/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const new_action_jwt = await createJwtActive();
    if (!new_action_jwt || new_action_jwt === null) {
      const response = {
        message: "Invalid new_action_jwt",
        data: {},
      };
      errorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 400 });
    }
    const response: GetActionTokenResponseType = {
      message: "ok",
      data: {
        action_token: new_action_jwt,
      },
    };
    getActionTokenResponseSchema.parse(response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /auth/action-token error:", error);
    const response: AuthErrorResponseType = {
      message: "Internal server error",
      data: {},
    };
    errorResponseSchema.parse(response);
    return NextResponse.json(response, { status: 500 });
  }
}
