import { NextRequest, NextResponse } from "next/server";
import { dataBase } from "@/utils/db_connect";

export async function POST(req: NextRequest) {
  try {
    const { userId, nikname, fraktion } = await req.json();

    if (!userId || !nikname || !fraktion) {
      return NextResponse.json({ message: "Неверные данные" }, { status: 400 });
    }

    const updated = await dataBase.profile.update({
      where: { userId: userId },
      data: {
        nikname: nikname,
        fraktion: fraktion,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
