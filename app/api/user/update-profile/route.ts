import { NextRequest, NextResponse } from "next/server";
import { dataBase } from "@/utils/db_connect";
import { z } from "zod";
import { Fraktion, Gender } from "@/_generated/prisma";

const updateProfileSchema = z.object({
  userId: z.string(),
  nikname: z.string().min(3, "Nickname is required"),
  fraktion: z.enum(Fraktion),
  gender: z.enum(Gender),
  color_theme: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const { userId, nikname, fraktion, gender, color_theme } = parsed.data;

    const updated = await dataBase.profile.update({
      where: { userId: userId },
      data: {
        nikname: nikname,
        fraktion: fraktion,
        gender: gender,
        color_theme: color_theme,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
