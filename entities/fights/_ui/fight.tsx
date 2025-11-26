"use client";
import { useStartFightMutation } from "@/features/fights/_mutations/use_start_fight_mutation";
import { useCurrentFight } from "../_queries/use_get_pending_fight_query";
import { useCreateFightMutation } from "@/features/fights/_mutations/use_create_fight_mutation";
import { Button } from "@/shared/components/ui/button";
import { FighterCard } from "./fighter_card";
import { FightSnapshot } from "../_domain/types";
import { EnemyType, FightType } from "@/_generated/prisma";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useEffect } from "react";
import { ui_path } from "@/shared/lib/paths";
import { useTranslation } from "@/features/translations/use_translation";
import { Spinner } from "@/shared/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function Fight({ enemy_type }: { enemy_type: EnemyType }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: fight, isLoading } = useCurrentFight();
  const createFight = useCreateFightMutation();
  const attack = useStartFightMutation();

  useEffect(() => {
    createFight.mutate({ enemyType: enemy_type, fightType: FightType.PVE });
  }, []);
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
              <Button className="w-full " disabled={attack.isPending || createFight.isPending} onClick={handleAttack}>
                {attack.isPending && <Spinner />}
                {!attack.isPending && t("fight.attack")}
              </Button>
            )}
            <Button className="w-full" onClick={handleStartFight} disabled={attack.isPending || createFight.isPending}>
              {createFight.isPending && <Spinner />}
              {!createFight.isPending && t("fight.next_enemy")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
