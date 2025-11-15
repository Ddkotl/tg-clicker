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

export default function Fight() {
  const { data: fight, isLoading } = useCurrentFight();
  const startFight = useCreateFightMutation();
  const attack = useStartFightMutation();

  const handleStartFight = () => {
    startFight.mutate({ enemyType: EnemyType.DEMONIC_BEAST, fightType: FightType.PVE });
  };

  const handleAttack = () => {
    attack.mutate();
  };

  if (isLoading || !fight?.data.snapshot) return <ComponentSpinner />;

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      {!fight && <Button onClick={handleStartFight}>Начать бой с демоническим зверем</Button>}

      {fight && (
        <>
          <div className="flex space-x-4 w-full justify-center">
            <FighterCard fighter={(fight.data.snapshot as FightSnapshot).player} title="Вы" />
            <FighterCard fighter={(fight.data.snapshot as FightSnapshot).enemy} title="Враг" />
          </div>

          <FightLogList log={fight.data.fightLog as FightLog} />

          {!fight.data.result && (
            <Button onClick={handleAttack} className="mt-4">
              Атаковать
            </Button>
          )}

          {fight.data.result && (
            <div className="mt-4 text-center">
              <p>Результат боя: {fight.data.result}</p>
              {fight.data.rewards && (
                <ul>
                  <li>Exp: {(fight.data.rewards as FightResRewards).exp}</li>
                  <li>Qi: {(fight.data.rewards as FightResRewards).qi}</li>
                  <li>Qi Stone: {(fight.data.rewards as FightResRewards).qiStone}</li>
                  <li>Glory: {(fight.data.rewards as FightResRewards).glory}</li>
                </ul>
              )}
              <Button onClick={handleStartFight} className="mt-2">
                Следующий враг
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
