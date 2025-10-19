"use client";

import Image from "next/image";

import { useTranslation } from "@/features/translations/use_translation";
import { calcParamCost } from "@/shared/game_config/params_cost";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";

type TrainingParamProps = {
  title: string;
  description: string;
  icon: string;
  value: number;
  paramName: string;
  hero_mana: number;
  isPending: boolean;
  onUpgrade: (paramName: string) => void;
};

export function TrainingParam({
  title,
  description,
  icon,
  value,
  paramName,
  hero_mana,
  isPending,
  onUpgrade,
}: TrainingParamProps) {
  const { t } = useTranslation();
  const nextCost = calcParamCost(paramName, value);

  const progress = Math.min(Math.floor((hero_mana / nextCost) * 100), 100);
  return (
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-3">
        <Image src={icon} alt={`${title} icon`} width={55} height={55} className="rounded-md" />
        <div className="flex-1 ">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex justify-between text-md">
            <span className="text-md font-semibold">
              {t("price")}: {nextCost}
            </span>
            <span>
              {value} {t("lvl").toLowerCase()}
            </span>
          </div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />

      <Button
        size="sm"
        className="w-full bg-primary/70"
        disabled={hero_mana < nextCost || isPending}
        onClick={() => onUpgrade(paramName)}
      >
        {t("training.upgrade")}
      </Button>
    </div>
  );
}
