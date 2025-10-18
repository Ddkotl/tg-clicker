"use client";

import Image from "next/image";
import { useTranslation } from "@/features/translations/use_translation";
import { useRegistration } from "../_vm/use_registration";
import { useNicknameValidation } from "../_vm/use_nickname_validation";
import { useRegistrationMutation } from "../_mutations/use_registration_mutation";
import { ChooseDefaultAvatarUrl } from "../_vm/choose_default_avatar_url";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { NicknameField } from "./nickname_field";
import { ThemeSelector } from "./theme_selector";
import { GenderSelector } from "./gender_selector";
import { FraktionSelector } from "./fraktion_selector";
import { Fraktion } from "@/_generated/prisma";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

export function Registration() {
  const { t } = useTranslation();
  const {
    userId,
    fraktion,
    setFraktion,
    gender,
    setGender,
    nickname,
    setNickname,
    theme,
    setTheme,
    isLoading,
  } = useRegistration();
  const { isChecking: isNiknameChecked, isValid: isNiknameValid } =
    useNicknameValidation(nickname);
  const mutation = useRegistrationMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !fraktion || !gender || !isNiknameValid) return;
    mutation.mutate({
      userId: userId,
      nikname: nickname,
      fraktion: fraktion,
      gender: gender,
      color_theme: theme,
      avatar_url: ChooseDefaultAvatarUrl(fraktion, gender),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.png" width={300} height={300} alt={t("loading")} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center  w-11/12  ">
      <Card className="py-4 shadow-lg px-2 w-full  max-w-md">
        <CardHeader className="px-1">
          <CardTitle className="text-center">
            {t("registration.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <NicknameField
              nickname={nickname}
              setNickname={setNickname}
              isNiknameChecked={isNiknameChecked}
              isNiknameValid={isNiknameValid}
            />
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <GenderSelector gender={gender} setGender={setGender} />

            <FraktionSelector
              gender={gender}
              fraktion={fraktion || Fraktion.ADEPT}
              setFraktion={setFraktion}
            />
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={
                mutation.isPending ||
                mutation.isSuccess ||
                !isNiknameValid ||
                !fraktion
              }
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  {t("button.saving")}
                </div>
              ) : (
                t("button.save")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
