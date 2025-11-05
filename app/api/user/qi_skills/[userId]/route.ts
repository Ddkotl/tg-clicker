import { NextResponse } from "next/server";
import { dataBase } from "@/shared/connect/db_connect";

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const api_params = await params;
  console.log(api_params);
  try {
    const skills = await dataBase.userQiSkills.findUnique({
      where: { userId: api_params.userId },
    });
    console.log(skills);
    if (!skills) {
      return NextResponse.json({ error: "Skills not found" }, { status: 404 });
    }

    return NextResponse.json(skills);
  } catch (err) {
    console.error("GET /api/qi-skills:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
