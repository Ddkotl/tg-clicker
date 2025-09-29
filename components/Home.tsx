"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileByTgIdType } from "@/repositories/user_repository";
import NavMenu from "./HomeNavigation";

export default function Home() {
  const { data, isLoading } = useQuery<getUserProfileByTgIdType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("api/user/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });
  if (isLoading) {
    return <div>loading</div>;
  }
  return (
    <div className="friends-tab-con flex flex-col gap-2 transition-all duration-300">
      <Card className="p-1 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-1">
          <CardTitle className="text-primary text-lg font-bold">
            ⚔️ Готов к испытанию?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-1 text-sm leading-relaxed text-card-foreground">
          <p>
            <b>Наставник:</b> Добро пожаловать, странник{" "}
            <b className="text-primary">{data?.profile?.nikname}</b>! Сегодня
            твой путь приведёт к великим свершениям! Баланс сил:{" "}
            <span className="text-primary font-semibold">
              Адепты горы – 698
            </span>
            ,{" "}
            <span className="text-primary font-semibold">
              Послушники долины – 709
            </span>
            .
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded-lg text-center">
              Потери Адептов: <b>0</b>
            </div>
            <div className="p-2 bg-muted rounded-lg text-center">
              Потери Послушников: <b>0</b>
            </div>
          </div>
        </CardContent>
      </Card>

      <NavMenu />
    </div>
  );
}
