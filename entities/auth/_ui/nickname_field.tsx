import { useTranslation } from "@/features/translations/use_translation";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

export function NicknameField({
  nickname,
  isNiknameChecked,
  isNiknameValid,
  setNickname,
}: {
  nickname: string;
  isNiknameChecked: boolean;
  isNiknameValid: boolean | null;
  setNickname: (v: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="nickname">{t("registration.nickname")}</Label>
      <Input
        id="nickname"
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        minLength={3}
        maxLength={20}
        required
        className={cn(
          nickname.length >= 3 && isNiknameValid === true && "border-green-500 focus-visible:ring-green-500/50",
          nickname.length >= 3 && isNiknameChecked && "border-blue-500 focus-visible:ring-blue-500/50",
          nickname.length >= 3 && isNiknameValid === false && "border-red-500 focus-visible:ring-red-500/50",
        )}
      />
      <div className="min-h-5 w-full text-sm">
        {nickname.length < 3 && nickname.length > 0 && (
          <p className="text-red-500">{t("validation.min", { number: "3" })}</p>
        )}
        {nickname.length >= 3 && isNiknameChecked && <p className="text-blue-500">{t("validation.check")}</p>}
        {nickname.length >= 3 && isNiknameValid === false && !isNiknameChecked && (
          <p className="text-red-500">{t("validation.nickname_taken", { nickname })}</p>
        )}
        {nickname.length >= 3 && isNiknameValid === true && !isNiknameChecked && (
          <p className="text-green-500">{t("validation.nickname_free", { nickname })}</p>
        )}
      </div>
    </div>
  );
}
