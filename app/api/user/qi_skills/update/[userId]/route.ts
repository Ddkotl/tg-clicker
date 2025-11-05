import { NextResponse } from "next/server";
import { dataBase } from "@/shared/connect/db_connect";
import { QiSkillKey, QiSkillsConfig } from "@/shared/game_config/qi_skills/qi_skills";

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
   const api_params = await params;
  try {
    const { skill } = (await req.json()) as { skill: QiSkillKey };

    if (!QiSkillsConfig[skill]) {
      return NextResponse.json({ error: "Unknown skill" }, { status: 400 });
    }

    const user = await dataBase.profile.findUnique({
      where: { userId: api_params.userId },
      select: { qi: true },
    });

    const skills = await dataBase.userQiSkills.findUnique({
      where: { userId: api_params.userId },
    });

    if (!user || !skills) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentLevel = skills[skill];
    const cfg = QiSkillsConfig[skill];

    if (currentLevel >= cfg.maxLevel) {
      return NextResponse.json({ error: "Max level reached" }, { status: 400 });
    }

    const cost = cfg.calcUpgradeCost(currentLevel);

    if (user.qi < cost) {
      return NextResponse.json({ error: "Not enough qi" }, { status: 400 });
    }

    await dataBase.$transaction([
      dataBase.userQiSkills.update({
        where: { userId: api_params.userId },
        data: { [skill]: { increment: 1 } },
      }),
      dataBase.profile.update({
        where: { userId: api_params.userId },
        data: { qi: { decrement: cost } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/qi-skills/upgrade:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
