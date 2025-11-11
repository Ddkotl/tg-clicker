"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/features/translations/use_translation";
import { icons } from "@/shared/lib/icons";
import Image from "next/image";
import { QiSkillKey, QiSkillsConfig } from "@/shared/game_config/qi_skills/qi_skills";
import { getQiRegenPerInterval } from "@/shared/game_config/params/qi_regen";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileResponse } from "@/entities/profile";
import { queries_keys } from "@/shared/lib/queries_keys";

interface QiSkillItemProps {
  userId: string;
  name: string;
  description: string;
  current_effect: string;
  next_effect: string;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  userCristal: number;
  onUpgrade: () => void;
  isUpgrading: boolean;
  iconSrc: string;
  skillKey: QiSkillKey;
}

export function QiSkillItem({
  userId,
  name,
  description,
  current_effect,
  next_effect,
  level,
  maxLevel,
  upgradeCost,
  userCristal,
  onUpgrade,
  isUpgrading,
  iconSrc,
  skillKey,
}: QiSkillItemProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  let profile;
  if (skillKey === "circulation_of_life") {
    profile = queryClient.getQueryData<ProfileResponse>(queries_keys.profile_userId(userId));
  }
  const progress = (level / maxLevel) * 100;
  const canUpgrade = level < maxLevel && userCristal >= upgradeCost && !isUpgrading;
  const current_skill_effect = QiSkillsConfig[skillKey].effects(level);
  const next_skill_effect = QiSkillsConfig[skillKey].effects(level + 1);
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
        <div className="text-sm text-muted-foreground mt-1 flex gap-2">
          {current_effect}:
          <b className="flex gap-1">
            {skillKey === "circulation_of_life" && profile?.data
              ? getQiRegenPerInterval({
                  power: profile.data.power,
                  protection: profile.data.protection,
                  skill: profile.data.skill,
                  speed: profile.data.speed,
                  qi_param: profile.data.qi_param,
                  lvl: profile.data.lvl,
                  circulation_of_life: current_skill_effect,
                  interval: 60 * 60 * 1000,
                })
              : current_skill_effect}
            {skillKey === "circulation_of_life" ? icons.qi_energy({}) : ""}
            {skillKey === "qi_veil" || skillKey === "seal_of_mind" ? " %" : ""}
          </b>
        </div>
        {QiSkillsConfig[skillKey].maxLevel > level && (
          <div className="text-sm text-muted-foreground mt-1 flex gap-2">
            {next_effect}:{" "}
            <b className="flex gap-1">
              {skillKey === "circulation_of_life" && profile?.data
                ? getQiRegenPerInterval({
                    power: profile.data.power,
                    protection: profile.data.protection,
                    skill: profile.data.skill,
                    speed: profile.data.speed,
                    qi_param: profile.data.qi_param,
                    lvl: profile.data.lvl,
                    circulation_of_life: next_skill_effect,
                    interval: 60 * 60 * 1000,
                  })
                : next_skill_effect}
              {skillKey === "circulation_of_life" ? icons.qi_energy({}) : ""}
              {skillKey === "qi_veil" || skillKey === "seal_of_mind" ? " %" : ""}
            </b>
          </div>
        )}

        <Button onClick={onUpgrade} disabled={!canUpgrade} className="mt-2 w-full">
          {t("upgrade_button")}
        </Button>
      </CardContent>
    </Card>
  );
}
