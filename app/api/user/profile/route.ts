import { errorResponseSchema } from "@/entities/auth";
import { getUserProfileByUserId } from "@/entities/auth/_repositories/user_repository";
import { AppJWTPayload, getSession } from "@/entities/auth/_vm/session";
import {
  ProfileErrorResponse,
  ProfileResponse,
  profileResponseSchema,
} from "@/entities/profile";
import { NextRequest, NextResponse } from "next/server";

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
