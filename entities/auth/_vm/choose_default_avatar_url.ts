import { Fraktion, Gender } from "@/_generated/prisma/enums";

export function ChooseDefaultAvatarUrl(fraktion: Fraktion, gender: Gender) {
  return gender === Gender.FEMALE
    ? fraktion === Fraktion.ADEPT
      ? "/adept_f.jpg"
      : "/novice_f.jpg"
    : fraktion === Fraktion.ADEPT
      ? "/adept_m.jpg"
      : "/novice_m.jpg";
}
