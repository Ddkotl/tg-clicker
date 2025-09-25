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
import { Fraktion, Profile } from "@/_generated/prisma";
import { toast } from "sonner";
interface CheckNicknameResponse {
  available: boolean;
}

export function Registration() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: profile, isLoading } = useQuery<getUserProfileByTgIdType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Не удалось загрузить пользователя");
      return res.json();
    },
  });

  const [nickname, setNickname] = useState("");
  const [fraktion, setFraktion] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (profile) {
      setNickname(profile.profile?.nikname || "");
      setFraktion(profile.profile?.fraktion || "");
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
        const res = await fetch(`/api/user/check-nickname?nickname=${nickname}`);
        const data: CheckNicknameResponse = await res.json();
        setIsNicknameValid(data.available);
      } catch {
        setIsNicknameValid(false);
      } finally {
        setIsChecking(false);
      }
    }, 1000);

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
        }),
      });
      if (!res.ok) throw new Error("Не удалось сохранить профиль");
      return res.json();
    },
    onSuccess: (data) => {
      toast(`${data.nikname}, поздравляю с успешной регистрацией`);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/game");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !fraktion || !isNicknameValid) return;
    mutation.mutate();
  };

  if (isLoading) {
    return <Image src="/loading.jpg" width={300} height={300} alt="загрузка" />;
  }

  if (!profile) {
    return <div className="text-center p-8 text-red-500">Пользователь не найден</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Никнейм */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nickname">Никнейм персонажа</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Введите никнейм"
                minLength={3}
                maxLength={20}
                required
              />
              <div className="min-h-5 w-full ">
                {nickname.length > 0 && nickname.length < 3 && (
                  <p className="text-red-500 text-sm ">Минимум 3 символа</p>
                )}
                {nickname.length >= 3 && isChecking && <p className="text-blue-500 text-sm">Проверка...</p>}
                {nickname.length >= 3 && isNicknameValid === false && !isChecking && (
                  <p className="text-red-500 text-sm">Никнейм уже занят</p>
                )}
                {nickname.length >= 3 && isNicknameValid === true && !isChecking && (
                  <p className="text-green-500 text-sm">Никнейм свободен</p>
                )}
              </div>
            </div>

            {/* Фракция — картинки */}
            <div className="flex flex-col gap-2">
              <Label>Выберите фракцию</Label>
              <div className="flex justify-around gap-4">
                {Object.values(Fraktion).map((f) => (
                  <div
                    key={f}
                    onClick={() => setFraktion(f)}
                    className={`  duration-500 transform  cursor-pointer rounded-xl border-2 p-2 ${
                      fraktion === f ? "border-green-500 scale-105 shadow-lg" : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={f === Fraktion.ADEPT ? "/adept.png" : "/novice.png"}
                      alt={f}
                      width={120}
                      height={120}
                      className="rounded-lg"
                    />
                    <p className="text-center mt-2 font-medium">{f === Fraktion.ADEPT ? "🧙‍♂️ Adept" : "⚔️ Novice"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка */}
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={mutation.isPending || mutation.isSuccess || !isNicknameValid || !fraktion}
            >
              {mutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
