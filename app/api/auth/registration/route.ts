import { NextRequest, NextResponse } from "next/server";
import {
  registrationErrorResponseSchema,
  RegistrationErrorResponseType,
  registrationRequestSchema,
  registrationResponseSchema,
  RegistrationResponseType,
} from "@/entities/auth";
import { RegistrationUser } from "@/entities/auth/index.server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registrationRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errorResponse: RegistrationErrorResponseType = {
        data: {},
        message: "Invalid request data",
      };
      registrationErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { userId, nikname, fraktion, gender, color_theme, avatar_url } = parsed.data;

    const updatedProfile = await RegistrationUser({
      userId,
      nikname,
      fraktion,
      gender,
      color_theme,
      avatar_url,
    });
    if (!updatedProfile) {
      const errorResponse: RegistrationErrorResponseType = {
        data: {},
        message: "Invalid registration user",
      };
      registrationErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const response: RegistrationResponseType = {
      data: {
        userId: updatedProfile.userId,
        nikname: updatedProfile.nikname,
        fraktion: updatedProfile.fraktion,
        gender: updatedProfile.gender,
        color_theme: updatedProfile.color_theme,
        avatar_url: updatedProfile.avatar_url ?? null,
      },
      message: "Profile updated successfully",
    };

    registrationResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /updateProfile error:", error);
    const errorResponse: RegistrationErrorResponseType = {
      data: {},
      message: "Internal server error",
    };
    registrationErrorResponseSchema.parse(errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
