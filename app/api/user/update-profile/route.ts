import { NextRequest, NextResponse } from "next/server";
import { dataBase } from "@/utils/db_connect";

export async function POST(req: NextRequest) {
  try {
    const { userId, nikname, fraktion, gender, color_theme } = await req.json();

    if (!userId || !nikname || !fraktion || !color_theme) {
      return NextResponse.json({ message: "Неверные данные" }, { status: 400 });
    }

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
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
