import Image from "next/image";
import { Fraktion, Gender } from "@/_generated/prisma";
import { useTranslation } from "@/features/translations/use_translation";
import { ChooseDefaultAvatarUrl } from "../_vm/choose_default_avatar_url";

export function FraktionSelector({
  gender,
  fraktion,
  setFraktion,
}: {
  gender: Gender;
  fraktion: Fraktion | null;
  setFraktion: (f: Fraktion) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span>{t("registration.faction")}</span>
      <div className="flex justify-around gap-2">
        {Object.values(Fraktion).map((f) => (
          <div
            key={f}
            onClick={() => setFraktion(f)}
            className={`duration-500 transform cursor-pointer rounded-xl border-2 max-w-[120px] ${
              fraktion === f
                ? "border-ring scale-105 shadow-lg"
                : "border-background"
            }`}
          >
            <Image
              src={ChooseDefaultAvatarUrl(f, gender)}
              alt={f}
              width={120}
              height={120}
              className="rounded-lg h-[120px] w-[120px]"
            />
            <p className="flex justify-center items-center text-center p-2 font-medium">
              {f === Fraktion.ADEPT
                ? t("fraction.adept")
                : t("fraction.novice")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
