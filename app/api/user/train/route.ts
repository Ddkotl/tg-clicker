import {
  ParamNameType,
  updateUserParam,
} from "@/entities/user/_repositories/update_user_param";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const trainSchema = z.object({
  paramName: z.enum(["power", "protection", "speed", "skill", "qi"]),
});

const trainResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    paramName: z.enum(["power", "protection", "speed", "skill", "qi"]),
    newValue: z.number(),
    mana: z.number(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export type TrainResponse = z.infer<typeof trainResponseSchema>;
export type TrainErrorResponse = z.infer<typeof errorResponseSchema>;

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      const errorResponse: TrainErrorResponse = {
        data: {},
        message: "Missing userId in URL",
      };
      errorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const body = await req.json();
    const parsed = trainSchema.safeParse(body);

    if (!parsed.success) {
      const errorResponse: TrainErrorResponse = {
        data: {},
        message: "Invalid request body",
      };
      errorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const paramName: ParamNameType = parsed.data.paramName;
    const updated_profile = await updateUserParam(userId, paramName);

    if (!updated_profile || !updated_profile.profile) {
      const errorResponse: TrainErrorResponse = {
        data: {},
        message: "Failed to update parameter",
      };
      errorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const newValue = updated_profile.profile[paramName];

    const response: TrainResponse = {
      data: {
        userId,
        paramName,
        newValue,
        mana: updated_profile.profile.mana,
      },
      message: "Parameter updated successfully",
    };
    trainResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /train error:", error);
    const errorResponse: TrainErrorResponse = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
