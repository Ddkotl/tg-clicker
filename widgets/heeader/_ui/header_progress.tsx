"use client";

import { Progress } from "@/shared/components/ui/progress";
import { lvl_exp } from "@/shared/game_config/exp/lvl_exp";
import { cn } from "@/shared/lib/utils";

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
    <div className="flex gap-1">
      {/* HP */}
      <div className="w-full relative">
        <Progress
          value={hpPercent}
          className={cn(
            "h-2  overflow-hidden bg-red-900/50 ",
            hpPercent < 30 && "animate-pulse",
            isLoading && "opacity-50",
            "[&>div]:bg-gradient-to-r [&>div]:from-red-600 [&>div]:to-red-400",
          )}
        />
        {!isLoading && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white select-none">
            {Math.round(hpPercent)}%
          </span>
        )}
      </div>

      {/* EXP */}
      <div className="w-full relative">
        <Progress
          value={expPercent}
          className={cn(
            "h-2  overflow-hidden bg-primary/40",
            isLoading && "opacity-50",
            "[&>div]:bg-gradient-to-r [&>div]:from-primary/60 [&>div]:to-primary",
          )}
        />
        {!isLoading && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white select-none">
            {Math.round(expPercent)}%
          </span>
        )}
      </div>
    </div>
  );
}
