"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfileByTgIdType } from "@/repositories/user_repository";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import { Fraktion, Gender, Profile } from "@/_generated/prisma";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use_translation";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";
import { Theme, useTheme } from "@/contexts/theme_context";
import { color_themes } from "@/config/color_thems";
interface CheckNicknameResponse {
  available: boolean;
}

export function Registration() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState("");
  const [fraktion, setFraktion] = useState<Fraktion | null>(null);
  const [gender, setGender] = useState<Gender>("MALE");
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { data: profile, isLoading } = useQuery<getUserProfileByTgIdType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Не удалось загрузить пользователя");
      return res.json();
    },
  });

  useEffect(() => {
    if (profile) {
      setNickname(profile.profile?.nikname || "");
      setFraktion(profile.profile?.fraktion || null);
      setGender(profile.profile?.gender || "MALE");
    }
  }, [profile]);

  useEffect(() => {
    if (!nickname || nickname.length < 3) {
      setIsNicknameValid(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsChecking(true);
        const res = await fetch(
          `/api/user/check-nickname?nickname=${nickname}`,
        );
        const data: CheckNicknameResponse = await res.json();
        setIsNicknameValid(data.available);
      } catch {
        setIsNicknameValid(false);
      } finally {
        setIsChecking(false);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [nickname]);

  const mutation = useMutation<Profile>({
    mutationFn: async () => {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile?.profile?.userId,
          nikname: nickname,
          fraktion: fraktion,
          gender: gender,
          color_theme: theme,
        }),
      });
      if (!res.ok) throw new Error("Не удалось сохранить профиль");
      return res.json();
    },
    onSuccess: (data) => {
      toast(t("auth_congratulation", { nikname: `${data.nikname}` }));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/game");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !fraktion || !gender || !isNicknameValid) return;
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <Image src="/loading.jpg" width={300} height={300} alt={t("loading")} />
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8 text-red-500">{t("auth_error")}</div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            {t("registration.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Никнейм */}
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
                  nickname.length >= 3 &&
                    isNicknameValid === true &&
                    "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/50",
                  nickname.length > 0 &&
                    nickname.length < 3 &&
                    "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50",
                  nickname.length >= 3 &&
                    isChecking &&
                    "border-blue-500 focus-visible:border-blue-500 focus-visible:ring-blue-500/50",
                )}
              />
              <div className="min-h-5 w-full ">
                {nickname.length > 0 && nickname.length < 3 && (
                  <p className="text-red-500 text-sm ">
                    {t("validation.min", { number: "3" })}
                  </p>
                )}
                {nickname.length >= 3 && isChecking && (
                  <p className="text-blue-500 text-sm">
                    {t("validation.check")}
                  </p>
                )}
                {nickname.length >= 3 &&
                  isNicknameValid === false &&
                  !isChecking && (
                    <p className="text-red-500 text-sm">
                      {t("validation.nickname_taken", {
                        nickname: `${nickname}`,
                      })}
                    </p>
                  )}
                {nickname.length >= 3 &&
                  isNicknameValid === true &&
                  !isChecking && (
                    <p className="text-green-500 text-sm">
                      {t("validation.nickname_free", {
                        nickname: `${nickname}`,
                      })}
                    </p>
                  )}
              </div>
            </div>

            {/* Тема */}
            <div className="flex flex-col gap-2">
              <Label>{t("theme.select")}</Label>
              <RadioGroup
                defaultValue={theme}
                onValueChange={(value) => {
                  document.documentElement.classList.remove(
                    "theme-red",
                    "theme-purple",
                    "theme-green",
                    "theme-yellow",
                    "theme-blue",
                  );
                  document.documentElement.classList.add(`theme-${value}`);
                  setTheme(value as Theme);
                }}
                className="flex gap-6  justify-between"
              >
                {color_themes.map((theme) => (
                  <div key={theme.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={theme.value}
                      id={theme.value}
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={theme.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className={`w-4 h-4  ${theme.color}`}></span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {/* Пол */}
            <div className="flex flex-col gap-2">
              <Label>{t("gender.gender")}</Label>
              <RadioGroup
                defaultValue="MALE"
                defaultChecked
                value={gender}
                onValueChange={(value) => setGender(value as Gender)}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="MALE"
                    id="male"
                    className="cursor-pointer"
                  />
                  <Label htmlFor="male">{t("gender.male")}</Label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="FEMALE"
                    id="female"
                    className="cursor-pointer"
                  />
                  <Label htmlFor="female">{t("gender.female")}</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Фракция */}
            <div className="flex flex-col gap-2">
              <Label>{t("registration.faction")}</Label>
              <div className="flex justify-around gap-2">
                {Object.values(Fraktion).map((f) => (
                  <div
                    key={f}
                    onClick={() => setFraktion(f)}
                    className={`duration-500 transform cursor-pointer rounded-xl border-2 max-w-[120px]  ${
                      fraktion === f
                        ? "border-ring scale-105 shadow-lg"
                        : "border-background"
                    }`}
                  >
                    <Image
                      src={
                        gender === "FEMALE"
                          ? f === Fraktion.ADEPT
                            ? "/adept_f.png"
                            : "/novice_f.jpg"
                          : f === Fraktion.ADEPT
                            ? "/adept_m.jpg"
                            : "/novice_m.png"
                      }
                      alt={f}
                      width={120}
                      height={120}
                      className="rounded-lg h-[120px] w-[120px]"
                    />
                    <p className="flex  justify-center items-center text-center p-2 font-medium">
                      {f === Fraktion.ADEPT
                        ? `${t("fraction.adept")}`
                        : `${t("fraction.novice")}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка */}
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={
                mutation.isPending ||
                mutation.isSuccess ||
                !isNicknameValid ||
                !fraktion
              }
            >
              {mutation.isPending
                ? `${t("button.saving")}`
                : `${t("button.save")}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
