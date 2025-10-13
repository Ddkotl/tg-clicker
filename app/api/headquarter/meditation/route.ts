import {
  goMeditationErrorResponseSchema,
  goMeditationErrorResponseType,
  goMeditationRequestSchema,
  goMeditationResponseSchema,
  goMeditationResponseType,
  MeditationInfoErrorResponse,
  MeditationInfoResponse,
  meditationInfoResponseSchema,
} from "@/entities/meditation";
import {
  getMeditationInfo,
  goMeditation,
} from "@/entities/meditation/index.server";
import { meditationQueue } from "@/shared/connect/queue";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    if (!requestedUserId) {
      const response: goMeditationErrorResponseType = {
        data: {},
        message: "User not authenticated",
      };
      goMeditationErrorResponseSchema.parse(response);
      return NextResponse.json(response, { status: 401 });
    }

    const meditation_info = await getMeditationInfo(requestedUserId);
    if (!meditation_info || meditation_info === null) {
      return NextResponse.json(
        { data: {}, message: "Meditation info not found" },
        { status: 404 },
      );
    }

    const response: MeditationInfoResponse = {
      data: {
        ...meditation_info,
      },
      message: "Meditation info fetched successfully",
    };

    meditationInfoResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/headquarter/meditation error:", error);
    const response: MeditationInfoErrorResponse = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = goMeditationRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errorResponse: goMeditationErrorResponseType = {
        data: {},
        message: "Invalid request data",
      };
      goMeditationErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const { userId, hours } = parsed.data;
    const meditate = await goMeditation(userId, hours);
    if (!meditate) {
      const errorResponse: goMeditationErrorResponseType = {
        data: {},
        message: "goMeditation error",
      };
      goMeditationErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const delay = hours * 60 * 60 * 1000;
    await meditationQueue.add("reward", { userId }, { delay });
    const response: goMeditationResponseType = {
      data: {
        userId: meditate.userId,
        meditation_hours: meditate.meditation_hours,
        on_meditation: meditate.on_meditation,
        start_meditation: meditate.start_meditation,
        meditation_revard: meditate.meditation_revard,
      },
      message: "goMeditation updated successfully",
    };
    goMeditationResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /headquarer/meditation error:", error);
    const errorResponse: goMeditationErrorResponseType = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
