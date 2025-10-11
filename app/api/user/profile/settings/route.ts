import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Fraktion, Gender } from "@/_generated/prisma";
import { dataBase } from "@/shared/utils/db_connect";

const updateProfileSchema = z.object({
  userId: z.string(),
  nikname: z.string().min(3, "Nickname must be at least 3 characters long"),
  fraktion: z.enum(Fraktion),
  gender: z.enum(Gender),
  color_theme: z.string(),
  avatar_url: z.string().optional(),
});

const updateProfileResponseSchema = z.object({
  data: z.object({
    userId: z.string(),
    nikname: z.string().nullable(),
    fraktion: z.enum(Fraktion).nullable(),
    gender: z.enum(Gender).nullable(),
    color_theme: z.string().nullable(),
    avatar_url: z.string().nullable(),
  }),
  message: z.string(),
});

const errorResponseSchema = z.object({
  data: z.object({}).optional(),
  message: z.string(),
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
export type UpdateProfileErrorResponse = z.infer<typeof errorResponseSchema>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const errorResponse: UpdateProfileErrorResponse = {
        data: {},
        message: "Invalid request data",
      };
      errorResponseSchema.parse(errorResponse);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { userId, nikname, fraktion, gender, color_theme, avatar_url } =
      parsed.data;

    const updatedProfile = await dataBase.profile.update({
      where: { userId },
      data: {
        nikname,
        fraktion,
        gender,
        color_theme,
        avatar_url,
      },
    });

    const response: UpdateProfileResponse = {
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

    updateProfileResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /updateProfile error:", error);
    const errorResponse: UpdateProfileErrorResponse = {
      data: {},
      message: "Internal server error",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
