"use client";
import { useStartFightMutation } from "@/features/fights/_mutations/use_start_fight_mutation";
import { useGetFightQuery } from "../../../entities/fights/_queries/use_get_fight_query";
import { useCreateFightMutation } from "@/features/fights/_mutations/use_create_fight_mutation";
import { FighterCard } from "../../../entities/fights/_ui/fighter_card";
import { FightSnapshot } from "../../../entities/fights/_domain/types";
import { EnemyType, FightStatus, FightType } from "@/_generated/prisma";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useEffect } from "react";
import { ui_path } from "@/shared/lib/paths";
import { useTranslation } from "@/features/translations/use_translation";
import { useRouter } from "next/navigation";
import { MutateButton } from "@/shared/components/custom_ui/mutate_button";
import { useProfileQuery } from "@/entities/profile";
import { useGetSessionQuery } from "@/entities/auth";
import { FIGHT_COOLDOWN } from "@/shared/game_config/fight/fight_const";
import { useCheckUserDealsStatus } from "@/entities/user/_queries/use_check_user_deals";

export function Fight({ enemy_type }: { enemy_type: EnemyType }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, isLoading: isSessionLoading, isFetching: isSessionFetching } = useGetSessionQuery();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useProfileQuery(session?.data?.user.userId || "");
  const { data: fight, isLoading: isLoadingFight } = useGetFightQuery({
    enemyType: enemy_type,
    status: FightStatus.PENDING,
  });
  const { busy, reason } = useCheckUserDealsStatus();
  const createFight = useCreateFightMutation();
  const attack = useStartFightMutation();

  useEffect(() => {
    createFight.mutate({ enemyType: enemy_type, fightType: FightType.PVE });
  }, [enemy_type]);
  const handleStartFight = () => {
    createFight.mutate({ enemyType: enemy_type, fightType: FightType.PVE });
  };

  const handleAttack = async () => {
    try {
      const results = await attack.mutateAsync();
      if (results.ok) {
        router.push(ui_path.fight_result_page(results.data.id));
      }
    } catch (error) {
      console.warn("Fight error:", error);
    }
  };
  const raw = profile?.data?.last_fight_time;
  const lastFightDate = raw ? new Date(raw) : new Date(0);

  const next_fight_time_ms = lastFightDate.getTime() + FIGHT_COOLDOWN;
  const isLoading = isSessionLoading || isProfileLoading || isLoadingFight;
  const isFetching = isProfileFetching || isSessionFetching;

  if (isLoading || !fight?.data.snapshot) return <ComponentSpinner />;

  return (
    <div className=" flex flex-col items-center ">
      {fight && (
        <div className=" flex flex-col gap-2 w-full">
          <div className="flex gap-2 w-full justify-center">
            <FighterCard fighter={(fight.data.snapshot as FightSnapshot).player} />
            <FighterCard fighter={(fight.data.snapshot as FightSnapshot).enemy} />
          </div>
          <div className="grid grid-cols-2 items-center  w-full justify-center gap-2">
            {!fight.data.result && (
              <MutateButton
                actionText={t("fight.attack")}
                cooldownEndMs={next_fight_time_ms}
                isBusy={busy}
                busyReason={reason}
                isDisabled={
                  attack.isPending || createFight.isPending || isFetching || next_fight_time_ms > Date.now() || busy
                }
                isCooldown={next_fight_time_ms > Date.now()}
                isMutatePending={attack.isPending}
                mutate={handleAttack}
              />
            )}
            <MutateButton
              actionText={t("fight.next_enemy")}
              isMutatePending={createFight.isPending}
              mutate={handleStartFight}
              isDisabled={attack.isPending || createFight.isPending || isFetching}
            />
          </div>
        </div>
      )}
    </div>
  );
}
