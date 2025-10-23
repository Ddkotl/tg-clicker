import { getMineResponseSchema, GetMineResponseType } from "@/entities/mining";
import { restoreEnergy } from "@/entities/mining/_vm/restore_mine_energy";
import { CreateUserMine, GetUserMine } from "@/entities/mining/index.server";
import { makeError } from "@/shared/lib/api_helpers/make_error";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return makeError("Missing userId parameter", 400);
    }

    const now = new Date();

    let user_mine = await GetUserMine(userId);
    if (!user_mine) {
      user_mine = await CreateUserMine(userId, now);
    }
    if (!user_mine || user_mine === null) {
      return makeError("invalid user_mine", 400);
    }

    user_mine = await restoreEnergy(userId, user_mine, now);

    const response: GetMineResponseType = {
      data: {
        userId,
        energy: user_mine.energy,
        last_energy_at: user_mine.last_mine_at?.getTime() ?? null,
        last_mine_at: user_mine.last_energy_at?.getTime() ?? null,
      },
      type: "ok",
      message: "Mining was successful",
    };

    getMineResponseSchema.parse(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /headquarter/mining:", error);
    return makeError("Internal server error", 500);
  }
}
