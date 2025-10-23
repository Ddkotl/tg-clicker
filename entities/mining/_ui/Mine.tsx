"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { getMineInfoQuery } from "@/entities/mining/_queries/get_mine_info_query";
import { useQuery } from "@tanstack/react-query";
import { useGetMiningReward } from "../_mutations/use_get_mining_reward";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { MiningResponseType } from "../_domain/types";

export default function Mine() {
  const { data: session } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const { data: mine, isLoading } = useQuery<MiningResponseType>({
    ...getMineInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useGetMiningReward();
  const [cooldown, setCooldown] = useState(0);

  // вычисляем оставшееся время кулдауна
  useEffect(() => {
    if (!mine?.data.last_mine_at) return;
    const last = new Date(mine.data.last_mine_at).getTime();
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((30_000 - (now - last)) / 1000));
    setCooldown(remaining);
  }, [mine?.data.last_mine_at]);

  // обновляем таймер каждую секунду
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => setCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  if (isLoading) return <p>Загрузка...</p>;
  const energy = mine?.data.energy ?? 50;
  const percent = (energy / 50) * 100;

  return (
    <div className="max-w-md mx-auto mt-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">⛏️ Шахта камней Ци</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-2">Энергия: {energy}/50</p>
          <Progress value={percent} className="h-2 mb-4" />

          <Button
            className="w-full py-4"
            onClick={() => mutation.mutate({ userId: userId ?? "" })}
            disabled={mutation.isPending || cooldown > 0 || energy <= 0}
          >
            {mutation.isPending
              ? "Добываем..."
              : cooldown > 0
                ? `Ожидание ${cooldown}s`
                : energy <= 0
                  ? "Нет энергии"
                  : "Добыть камни"}
          </Button>

          {mutation.isError && <p className="text-red-500 mt-2">{mutation.error?.message ?? "Ошибка добычи"}</p>}
          {mutation.data?.data.gold_reward !== undefined && (
            <p className="mt-2">Вы добыли {mutation.data.data.gold_reward} камней!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
