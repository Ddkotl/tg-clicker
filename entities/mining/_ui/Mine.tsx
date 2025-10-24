"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { getMineInfoQuery } from "@/entities/mining/_queries/get_mine_info_query";
import { useQuery } from "@tanstack/react-query";
import { useGetMiningReward } from "../_mutations/use_get_mining_reward";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { MiningResponseType } from "../_domain/types";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { useEffect, useState } from "react";
import { useTranslation } from "@/features/translations/use_translation";

export default function Mine() {
  const { t } = useTranslation();
  const { data: session } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const {
    data: mine,
    isLoading,
    refetch,
  } = useQuery<MiningResponseType>({
    ...getMineInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useGetMiningReward();

  const [mineCooldown, setMineCooldown] = useState(0);
  const [energyCooldown, setEnergyCooldown] = useState(0);

  const now = Date.now();
  const lastMineAt = mine?.data.last_mine_at ?? 0;
  const lastEnergyAt = mine?.data.last_energy_at ?? 0;

  const MINE_COOLDOWN = 30_000; // 30 секунд
  const ENERGY_COOLDOWN = 30 * 60 * 1000; // 30 минут

  // вычисляем оставшееся время кулдауна и восстановления энергии
  useEffect(() => {
    const mineTime = Math.max(0, lastMineAt + MINE_COOLDOWN - now);
    const energyTime = Math.max(0, lastEnergyAt + ENERGY_COOLDOWN - now);
    setMineCooldown(Math.ceil(mineTime / 1000));
    setEnergyCooldown(Math.ceil(energyTime / 1000));

    const interval = setInterval(() => {
      setMineCooldown((v) => {
        const next = Math.max(v - 1, 0);
        if (next === 0) refetch(); // когда кулдаун истёк, рефетчим
        return next;
      });
      setEnergyCooldown((v) => {
        const next = Math.max(v - 1, 0);
        if (next === 0) refetch(); // когда энергия восстановилась, рефетчим
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastMineAt, lastEnergyAt, refetch, now]);

  if (isLoading) return <p className="text-center mt-6 text-sm text-muted-foreground">Загрузка данных шахты...</p>;

  const energy = mine?.data.energy ?? 50;
  const percent = (energy / 50) * 100;

  const canMine = energy > 0 && mineCooldown === 0;

  return (
    <div className="flex flex-col gap-3">
      <PageDescription
        title={t("headquarter.mine_page.title")}
        highlight={t("headquarter.mine_page.highlight")}
        text={t("headquarter.mine_page.text")}
      />

      <div className="max-w-md mx-auto w-full">
        <Card className="shadow-lg border-border/50 bg-card/70 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-center">Шахта камней Ци</CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Энергия: <span className="font-medium text-foreground">{energy}/50</span>
              </p>
              <Progress value={percent} className="h-2" />
            </div>

            <div className="flex justify-between text-xs text-foreground/70 mt-1">
              {mineCooldown > 0 && <CountdownTimer endTime={Date.now() + mineCooldown * 1000} label="Добыча через:" />}
              {energyCooldown > 0 && (
                <CountdownTimer endTime={Date.now() + energyCooldown * 1000} label="Восстановление энергии:" />
              )}
            </div>

            <Button
              size="lg"
              className="w-full py-5 mt-3"
              onClick={() => mutation.mutate({ userId: userId ?? "" })}
              disabled={!canMine || mutation.isPending}
            >
              {mutation.isPending ? "⛏️ Добываем..." : canMine ? "Добыть камни" : "⛔ Недоступно"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
