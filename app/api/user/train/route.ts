import {
  trainErrorResponseSchema,
  TrainErrorResponseType,
  trainResponseSchema,
  TrainResponseType,
  trainSchema,
} from "@/entities/profile";
import { ParamNameType, updateUserParam } from "@/entities/profile/_repositories/update_user_param";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      const errorResponse: TrainErrorResponseType = {
        data: {},
        message: "Missing userId in URL",
      };
      trainErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    const body = await req.json();
    const parsed = trainSchema.safeParse(body);

    if (!parsed.success) {
      const errorResponse: TrainErrorResponseType = {
        data: {},
        message: "Invalid request body",
      };
      trainErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    const paramName: ParamNameType = parsed.data.paramName;
    const updated_profile = await updateUserParam(userId, paramName);

    if (!updated_profile || !updated_profile.profile) {
      const errorResponse: TrainErrorResponseType = {
        data: {},
        message: "Failed to update parameter",
      };
      trainErrorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, {
        status: 400,
      });
    }

    const newValue = updated_profile.profile[paramName];

    const response: TrainResponseType = {
      data: {
        userId,
        paramName,
        newValue,
        qi: updated_profile.profile.qi,
        max_hitpoint: updated_profile.profile.max_hitpoint,
        last_hp_update: updated_profile.profile.last_hp_update,
      },
      message: "Parameter updated successfully",
    };
    trainResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /train error:", error);
    const errorResponse: TrainErrorResponseType = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse, {
      status: 500,
    });
  }
}
