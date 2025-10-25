"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { getMineInfoQuery } from "@/entities/mining/_queries/get_mine_info_query";
import { useQuery } from "@tanstack/react-query";
import { useGetMiningReward } from "../_mutations/use_get_mining_reward";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { GetMineResponseType } from "../_domain/types";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { useTranslation } from "@/features/translations/use_translation";
import * as MiningConst from "@/shared/game_config/mining/mining_const";
import { cn } from "@/shared/lib/utils";
import { Spinner } from "@/shared/components/ui/spinner";
import { useEffect, useState } from "react";
import { img_paths } from "@/shared/lib/img_paths";

export default function Mine() {
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  const userId = session?.data?.user.userId;

  const {
    data: mine,
    isLoading,
    refetch,
  } = useQuery<GetMineResponseType>({
    ...getMineInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useGetMiningReward();
  const [now, setNow] = useState(new Date());
  // Обновляем данные после успешной добычи
  useEffect(() => {
    if (mutation.isSuccess) {
      setNow(new Date());
    }
  }, [mutation.isSuccess, refetch, setNow]);

  if (isLoading || isSessionLoading || !mine?.data.last_energy_at || !mine?.data.last_mine_at) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  const energy = mine?.data.energy ?? MiningConst.MAX_ENERGY;
  const percent = (energy / MiningConst.MAX_ENERGY) * 100;

  return (
    <div className="flex flex-col gap-2">
      <PageDescription
        img={img_paths.mining_cave()}
        title={t("headquarter.mine_page.title")}
        highlight={t("headquarter.mine_page.highlight")}
        text={t("headquarter.mine_page.text")}
      />

      <div className="max-w-md mx-auto w-full">
        <Card className="shadow-lg border-border/50 bg-card/70 backdrop-blur p-1">
          <CardContent className="text-center space-y-3 p-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-muted-foreground">
                  {t("headquarter.mine_page.energy")}{" "}
                  <span className="font-medium text-foreground">
                    {energy}/{MiningConst.MAX_ENERGY}
                  </span>
                </p>
                {energy < MiningConst.MAX_ENERGY && (
                  <CountdownTimer
                    endTime={mine.data.last_energy_at + MiningConst.ENERGY_RECHARGE_INTERVAL}
                    label={t("headquarter.mine_page.energy_recovery")}
                    onComplete={refetch}
                  />
                )}
              </div>
              <Progress value={percent} className="h-2" />
            </div>
            {/* Кнопка добычи */}
            <Button
              className={cn(
                "w-full flex items-center justify-center gap-2 transition-opacity py-4",
                (energy < 0 ||
                  now.getTime() < mine.data.last_mine_at + MiningConst.MINE_COOLDOWN ||
                  mutation.isPending) &&
                  "pointer-events-none opacity-40",
              )}
              size="lg"
              onClick={() => mutation.mutate({ userId: userId ?? "" })}
              disabled={
                energy < 0 || now.getTime() < mine.data.last_mine_at + MiningConst.MINE_COOLDOWN || mutation.isPending
              }
            >
              {now.getTime() < mine.data.last_mine_at + MiningConst.MINE_COOLDOWN && (
                <CountdownTimer
                  endTime={mine.data.last_mine_at + MiningConst.MINE_COOLDOWN}
                  onComplete={() => setNow(new Date())}
                />
              )}
              {mutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4" />
                  {t("headquarter.mine_page.mining_in_progress")}
                </>
              ) : (
                t("headquarter.mine_page.get_qi_stones")
              )}
            </Button>
            {/* Таймер до следующей добычи */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
