import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Gender } from "@/_generated/prisma";
import { useTranslation } from "@/features/translations/use_translation";
import { Label } from "@/shared/components/ui/label";

export function GenderSelector({
  gender,
  setGender,
}: {
  gender: Gender;
  setGender: (g: Gender) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <Label>{t("gender.gender")}</Label>
      <RadioGroup
        value={gender}
        onValueChange={(value) => setGender(value as Gender)}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value={Gender.MALE} id="male" />
          <Label htmlFor="male">{t("gender.male")}</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value={Gender.FEMALE} id="female" />
          <Label htmlFor="female">{t("gender.female")}</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
