"use client";

import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { calcParamCost } from "@/config/params_cost";

type TrainingParamProps = {
  title: string;
  description: string;
  icon: string;
  value: number;
  paramName: string;
  onUpgrade?: (paramName: string) => void;
};

export function TrainingParam({
  title,
  description,
  icon,
  value,
  paramName,
  onUpgrade,
}: TrainingParamProps) {
  const currentCost = calcParamCost(paramName, value);
  const nextCost = calcParamCost(paramName, value + 1);

  const progress = Math.floor((currentCost / nextCost) * 100);

  return (
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-3">
        <Image
          src={icon}
          alt={`${title} icon`}
          width={55}
          height={55}
          className="rounded-md"
        />
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex justify-between text-xs">
            <span>Уровень: {value}</span>
            <span className="text-muted-foreground">Цена: {nextCost}</span>
          </div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />

      <Button
        size="sm"
        className="w-full bg-primary/70"
        onClick={() => onUpgrade?.(paramName)}
      >
        Улучшить
      </Button>
    </div>
  );
}
