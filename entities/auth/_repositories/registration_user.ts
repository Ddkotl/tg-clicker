import { dataBase } from "@/shared/connect/db_connect";
import { Fraktion, Gender } from "@/_generated/prisma/enums";

export async function RegistrationUser({
  userId,
  nikname,
  fraktion,
  gender,
  color_theme,
  avatar_url,
}: {
  userId: string;
  nikname: string;
  fraktion: Fraktion;
  gender: Gender;
  color_theme: string;
  avatar_url: string | undefined;
}) {
  try {
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
    return updatedProfile;
  } catch (error) {
    console.error("не удалось зарегистрировать пользователя", error);
    return null;
  }
}
