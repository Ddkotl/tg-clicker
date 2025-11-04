"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { GetDailyMissionsResponseType } from "../_domain/types";
import { getMissionTitle } from "../_vm/get_mission_title";
import { icons } from "@/shared/lib/icons";
import { TranslationKey } from "@/features/translations/translate_type";
import { ui_path } from "@/shared/lib/paths";
import Link from "next/link";

type Mission = GetDailyMissionsResponseType["data"]["missions"][number];

export function MissionCard({
  mission,
  t,
}: {
  mission: Mission;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const progressPercent = mission.target_value ? Math.min(100, (mission.progress / mission.target_value) * 100) : 0;

  const title = getMissionTitle(t, mission);

  const rewards = [
    {
      value: mission.reward_exp,
      label: t("experience"),
      icon: icons.exp({}),
    },
    {
      value: mission.reward_qi,
      label: t("qi_energy"),
      icon: icons.qi_energy({}),
    },
    {
      value: mission.reward_qi_stone,
      label: t("qi_stone"),
      icon: icons.stone({}),
    },
    {
      value: mission.reward_spirit_cristal,
      label: t("spirit_cristal"),
      icon: icons.crystal({}),
    },
    {
      value: mission.reward_glory,
      label: t("glory"),
      icon: icons.glory({}),
    },
  ].filter((r) => r.value > 0);
  return (
    <Card className="bg-background/50 border border-border">
      <CardHeader className="flex gap-2 justify-between items-center">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <Link
          href={mission.path ?? ui_path.home_page()}
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
        >
          {icons.arrow_right({})}
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress value={progressPercent} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {t("progress")}: {mission.progress} / {mission.target_value}
        </div>

        {rewards.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40 mt-2">
            {rewards.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-1 text-xs text-muted-foreground">
                {Icon}
                <span>
                  {label}: {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
