import { getSession } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";
import { AppJWTPayload } from "../../auth/route";
import { addPointsToUser } from "@/repositories/user_repository";
import { z } from "zod";

const PointsSchema = z.object({
  points: z.number().int().positive(),
});

export type PointsResponse = { points: number } | { isAuthenticated: false } | { message: string };

export async function POST(request: NextRequest) {
  const session: AppJWTPayload | null = await getSession();

  if (!session) {
    return NextResponse.json<PointsResponse>({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const data = PointsSchema.parse(await request.json());

    const updatedUser = await addPointsToUser(data.points, session.user.telegram_id);
    if (!updatedUser) {
      return NextResponse.json<PointsResponse>({ message: "Update user error" }, { status: 500 });
    }
    return NextResponse.json<PointsResponse>({ points: updatedUser.points });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json<PointsResponse>({ message: "Invalid points" }, { status: 400 });
    }
    console.error("Failed to add points:", err);
    return NextResponse.json<PointsResponse>({ message: "Server error" }, { status: 500 });
  }
}
