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
import { useEffect, useState } from "react";
import { MutateButton } from "@/shared/components/custom_ui/mutate_button";
import { useTranslation } from "@/features/translations/use_translation";

export default function Mine() {
  const { t } = useTranslation();

  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  const userId = session?.data?.user.userId;
  const deals = useCheckUserDealsStatus();

  // 1️⃣ Загружаем данные шахты
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

  // 2️⃣ Тик раз в секунду — единственный источник текущего времени
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  // 3️⃣ Derived values — вычисляются без useState
  const lastMine = mine?.data.last_mine_at ?? 0;
  const cooldownEnd = lastMine + MINE_COOLDOWN;
  const isCooldown = now < cooldownEnd;

  const disabled = energy <= 0 || isCooldown || mutation.isPending || deals.busy;

  if (isLoading || isSessionLoading || !mine?.data.last_energy_at || !mine?.data.last_mine_at) {
    return <ComponentSpinner />;
  }

  return (
    <div className="max-w-md mx-auto w-full">
      <Card className="shadow-lg border-border/50 bg-card/70 backdrop-blur p-1">
        <CardContent className="text-center space-y-3 p-3">
          <MineEnergySection energy={energy} lastEnergyAt={mine.data.last_energy_at} onEnergyRecovered={refetch} />

          <MutateButton
            cooldownEndMs={cooldownEnd}
            handleCooldownEnd={refetch}
            isDisabled={disabled}
            isCooldown={isCooldown}
            isBusy={deals.busy}
            isMutatePending={mutation.isPending}
            mutate={() => mutation.mutate({ userId: userId ?? "" })}
            busyReason={deals.reason}
            actionText={t("headquarter.mine_page.get_qi_stones")}
            pendingText={t("headquarter.mine_page.mining_in_progress")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
