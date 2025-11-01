"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { MineEnergySection } from "./mine_energy_section";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useGetMiningReward } from "../_mutations/use_get_mining_reward";
import { GetMineResponseType } from "../_domain/types";
import { useQuery } from "@tanstack/react-query";
import { getMineInfoQuery } from "../_queries/get_mine_info_query";
import { useCheckUserDealsStatus } from "@/entities/user/_queries/use_check_user_deals";
import { useGetSessionQuery } from "@/entities/auth";
import { MAX_ENERGY, MINE_COOLDOWN } from "@/shared/game_config/mining/mining_const";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import { useTranslation } from "@/features/translations/use_translation";
import React, { useState } from "react";

export default function Mine() {
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  const userId = session?.data?.user.userId;
  const deals = useCheckUserDealsStatus();

  const {
    data: mine,
    isLoading,
    refetch,
  } = useQuery<GetMineResponseType>({
    ...getMineInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useGetMiningReward();
  const energy = mine?.data.energy ?? MAX_ENERGY;

  // состояние кулдауна для кнопки
  const [end, setEnd] = useState(Date.now());
  const [isCooldown, setIsCooldown] = useState(() =>
    mine ? Date.now() < mine.data.last_mine_at + MINE_COOLDOWN : false,
  );

  // пересчет при изменении last_mine_at
  React.useEffect(() => {
    if (mine?.data.last_mine_at) {
      setEnd(mine.data.last_mine_at + MINE_COOLDOWN);
      setIsCooldown(Date.now() < mine.data.last_mine_at + MINE_COOLDOWN);
    }
  }, [mine?.data.last_mine_at]);

  const handleCooldownEnd = () => {
    setIsCooldown(false); // разблокируем кнопку
    refetch(); // обновляем данные
  };

  if (isLoading || isSessionLoading || !mine?.data.last_energy_at || !mine?.data.last_mine_at) {
    return <ComponentSpinner />;
  }

  const disabled = energy <= 0 || isCooldown || mutation.isPending || deals.busy;

  return (
    <div className="max-w-md mx-auto w-full">
      <Card className="shadow-lg border-border/50 bg-card/70 backdrop-blur p-1">
        <CardContent className="text-center space-y-3 p-3">
          <MineEnergySection energy={energy} lastEnergyAt={mine.data.last_energy_at} onEnergyRecovered={refetch} />

          <Button
            className={cn(
              "w-full flex items-center justify-center gap-2 transition-opacity py-4",
              disabled && "pointer-events-none opacity-40",
            )}
            size="lg"
            disabled={disabled}
            onClick={() => mutation.mutate({ userId: userId ?? "" })}
          >
            {deals.busy ? (
              <span>{deals.reason}</span>
            ) : (
              <div className="flex items-center gap-2">
                {isCooldown && <CountdownTimer endTime={end} onComplete={handleCooldownEnd} />}
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    {t("headquarter.mine_page.mining_in_progress")}
                  </div>
                ) : (
                  t("headquarter.mine_page.get_qi_stones")
                )}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
