"use client";

import { useStartFightMutation } from "@/features/fights/_mutations/use_start_fight_mutation";
import { useCurrentFight } from "../_queries/use_get_pending_fight_query";
import { useCreateFightMutation } from "@/features/fights/_mutations/use_create_fight_mutation";
import { Button } from "@/shared/components/ui/button";
import { FighterCard } from "./fighter_card";
import { FightLog, FightResRewards, FightSnapshot } from "../_domain/types";
import { FightLogList } from "./fight_log_list";
import { EnemyType, FightType } from "@/_generated/prisma";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { ui_path } from "@/shared/lib/paths";

export default function Fight() {
  const { data: fight, isLoading } = useCurrentFight();
  const createFight = useCreateFightMutation();
  const attack = useStartFightMutation();

  useEffect(() => {
    if (!fight) {
      createFight.mutate({ enemyType: EnemyType.DEMONIC_BEAST, fightType: FightType.PVE });
    }
  }, [fight]);
  const handleStartFight = () => {
    createFight.mutate({ enemyType: EnemyType.DEMONIC_BEAST, fightType: FightType.PVE });
  };

  const handleAttack = async () => {
    const results = await attack.mutateAsync();
    if (results.data.id) {
      redirect(ui_path.fight_result_page(results.data.id));
    }
  };

  if (isLoading || !fight?.data.snapshot) return <ComponentSpinner />;

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      {fight && (
        <>
          <div className="flex space-x-4 w-full justify-center">
            <FighterCard fighter={(fight.data.snapshot as FightSnapshot).player} />
            <FighterCard fighter={(fight.data.snapshot as FightSnapshot).enemy} />
          </div>
          <div className="flex gap-2">
            {!fight.data.result && <Button onClick={handleAttack}>Атаковать</Button>}
            <Button onClick={handleStartFight} disabled={attack.isPending}>
              Следующий враг
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
