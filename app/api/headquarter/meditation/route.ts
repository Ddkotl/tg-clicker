import { getUserProfileByUserId } from "@/entities/auth/_repositories/user_repository";
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
import { calcMeditationReward } from "@/entities/meditation/_vm/calc_meditation_reward";
import { getMeditationInfo, goMeditation } from "@/entities/meditation/index.server";
import {
  createRabbitMeditationConnection,
  MEDITATION_EXCHANGE,
  MEDITATION_QUEUE,
} from "@/features/meditation/rabit_meditation_connect";
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
      return NextResponse.json({ data: {}, message: "Meditation info not found" }, { status: 404 });
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
    const user_params = await getUserProfileByUserId(userId);
    if (
      !user_params ||
      user_params.profile?.power === undefined ||
      user_params.profile?.protection === undefined ||
      user_params.profile?.speed === undefined ||
      user_params.profile?.skill === undefined ||
      user_params.profile?.qi === undefined
    ) {
      const errorResponse: goMeditationErrorResponseType = {
        data: {},
        message: "getUserProfileByUserId error",
      };
      goMeditationErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const meditation_revard = calcMeditationReward({
      power: user_params.profile.power,
      protection: user_params.profile.protection,
      speed: user_params.profile.speed,
      skill: user_params.profile.skill,
      qi: user_params.profile.qi,
      hours,
    });
    const meditate = await goMeditation(userId, hours, meditation_revard);
    if (!meditate) {
      const errorResponse: goMeditationErrorResponseType = {
        data: {},
        message: "goMeditation error",
      };
      goMeditationErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const delay = hours * 60 * 60 * 1000;
    // const delay = hours * 1000;
    const { channel, connection } = await createRabbitMeditationConnection();
    channel.publish(MEDITATION_EXCHANGE, MEDITATION_QUEUE, Buffer.from(JSON.stringify({ userId })), {
      headers: { "x-delay": delay },
      persistent: true,
    });
    await channel.close();
    await connection.close();
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
