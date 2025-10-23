"use client";

import { Progress } from "@/shared/components/ui/progress";
import { lvl_exp } from "@/shared/game_config/exp/lvl_exp";
import clsx from "clsx";

interface HeaderProgressBarsProps {
  currentHP?: number;
  maxHP?: number;
  currentExp?: number;
  lvl?: number;
  isLoading?: boolean;
}

export function HeaderProgressBars({
  currentHP = 0,
  maxHP = 1,
  currentExp = 0,
  lvl = 1,
  isLoading,
}: HeaderProgressBarsProps) {
  const hpPercent = Math.min((currentHP / maxHP) * 100, 100);

  const prevLevelExp = lvl_exp[lvl] ?? 0;
  const nextLevelExp = lvl_exp[lvl + 1] ?? lvl_exp[lvl] ?? 1;
  const expBetweenLevels = nextLevelExp - prevLevelExp;
  const expProgress = currentExp - prevLevelExp;
  const expPercent = Math.min((expProgress / expBetweenLevels) * 100, 100);

  return (
    <div className="flex  gap-1 p-2">
      <div className="w-full relative">
        <Progress
          value={hpPercent}
          className={clsx(
            "h-2 rounded-full bg-red-950/40",
            hpPercent < 30 && "bg-red-900/70",
            isLoading && "opacity-50",
          )}
        />
        {!isLoading && (
          <span className="absolute inset-0 text-xs text-center text-white font-medium">
            {currentHP}/{maxHP}
          </span>
        )}
      </div>

      <div className="w-full relative">
        <Progress value={expPercent} className={clsx("h-2 rounded-full bg-purple-900/40", isLoading && "opacity-50")} />
        {!isLoading && (
          <span className="absolute inset-0 text-xs text-center text-white font-medium">
            {currentExp}/{nextLevelExp}
          </span>
        )}
      </div>
    </div>
  );
}
