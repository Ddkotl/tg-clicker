"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/features/translations/use_translation";
import { icons } from "@/shared/lib/icons";
import Image from "next/image";

interface QiSkillItemProps {
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  userCristal: number;
  onUpgrade: () => void;
  isUpgrading: boolean;
  iconSrc: string;
}

export function QiSkillItem({
  name,
  description,
  level,
  maxLevel,
  upgradeCost,
  userCristal,
  onUpgrade,
  isUpgrading,
  iconSrc,
}: QiSkillItemProps) {
  const { t } = useTranslation();
  const progress = (level / maxLevel) * 100;
  const canUpgrade = level < maxLevel && userCristal >= upgradeCost && !isUpgrading;

  return (
    <Card className="flex flex-col py-2 gap-2 border rounded-2xl shadow-sm">
      <CardHeader className=" px-2 flex items-center gap-2">
        {iconSrc && <Image src={iconSrc} alt={name} width={40} height={40} className="rounded-full" />}
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
      </CardHeader>

      <CardContent className=" px-2 flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">{description}</div>

        <Progress value={progress} className="h-3 rounded-full" />

        <div className="flex justify-between text-sm">
          <span>
            {t("lvl")}: <b>{level}</b> / {maxLevel}
          </span>
          <span className="flex gap-1">
            {t("upgrade_cost")}: <b>{upgradeCost}</b> {icons.crystal({})}
          </span>
        </div>

        <Button onClick={onUpgrade} disabled={!canUpgrade} className="mt-2 w-full">
          {t("upgrade_button")}
        </Button>
      </CardContent>
    </Card>
  );
}
