"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { useLanguage } from "@/features/translations/lang_context";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { getHoursString } from "@/entities/meditation/_vm/getHoursString";
import { icons } from "@/shared/lib/icons";
import { ui_path } from "@/shared/lib/paths";
import Link from "next/link";
import { FightResRewards } from "@/entities/fights";
import { FightResLossesSchema } from "@/entities/fights/_domain/types";
import { getLocalFormatedDate } from "@/shared/lib/date";
import { FactsType } from "@/_generated/prisma/enums";
import { Facts } from "@/_generated/prisma/client";

export function FactItem({
  fact,
  t,
}: {
  fact: Facts;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const { language } = useLanguage();

  const formatReward = (label: string, value: number | null | undefined, icon: React.ReactNode) =>
    value && value > 0
      ? {
          icon,
          text: `${label}: ${value}`,
        }
      : null;

  const config = (() => {
    switch (fact.type) {
      case FactsType.FIGHTS_WIN: {
        const isPlayerAttacker = fact.fight_atacker_id === fact.userId;

        return {
          icon: icons.fight({ className: "text-green-400" }),
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          separator: "bg-green-500/20",
          title: isPlayerAttacker
            ? t("facts.fight.fight_win1", { opponent: t(`fight.oponents.${fact.enemy_type}` as TranslationKey) })
            : t("facts.fight.fight_win2", { opponent: t(`fight.oponents.${fact.enemy_type}` as TranslationKey) }),

          rewards: [
            formatReward(t("qi_energy"), (fact.fight_rewards as FightResRewards)?.qi, icons.qi_energy({})),
            formatReward(t("experience"), (fact?.fight_rewards as FightResRewards)?.exp, icons.exp({})),
            formatReward(t("qi_stone"), (fact.fight_rewards as FightResRewards)?.qiStone, icons.stone({})),
            formatReward(
              t("spirit_cristal"),
              (fact.fight_rewards as FightResRewards)?.spiritCristal,
              icons.crystal({}),
            ),
            formatReward(t("glory"), (fact.fight_rewards as FightResRewards)?.glory, icons.glory({})),
          ].filter(Boolean),
          link: ui_path.fight_result_page(fact.fight_id || ""),
        };
      }
      case FactsType.FIGHTS_LOSE: {
        const isPlayerAttacker = fact.fight_atacker_id === fact.userId;

        return {
          icon: icons.fight({ className: "text-red-400" }),
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          separator: "bg-red-500/20",
          title: isPlayerAttacker
            ? t("facts.fight.fight_lose1", { opponent: t(`fight.oponents.${fact.enemy_type}` as TranslationKey) })
            : t("facts.fight.fight_lose2", { opponent: t(`fight.oponents.${fact.enemy_type}` as TranslationKey) }),

          rewards: [
            formatReward(t("qi_energy"), (fact.fight_losses as FightResLossesSchema)?.qi, icons.qi_energy({})),
            formatReward(t("qi_stone"), (fact.fight_losses as FightResLossesSchema)?.qiStone, icons.stone({})),
          ].filter(Boolean),
          link: ui_path.fight_result_page(fact.fight_id || ""),
        };
      }
      case FactsType.MEDITATION:
        return {
          icon: icons.meditation({ className: "text-purple-400" }),
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          separator: "bg-purple-500/20",
          title: t("facts.meditation_fact1", {
            time: `${fact.active_hours} ${t(`hour.${getHoursString(fact.active_hours ?? 0)}` as TranslationKey)}`,
          }),
          rewards: [
            formatReward(t("facts.meditation_fact2"), fact.qi_reward, icons.qi_energy({})),
            formatReward(t("facts.meditation_fact3"), fact.exp_reward, icons.exp({})),
          ].filter(Boolean),
        };

      case FactsType.MISSION:
        return {
          icon: icons.meditation({ className: "text-amber-400" }),
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          separator: "bg-amber-500/20",
          title: t("facts.mission", {
            mission: t(`headquarter.missions.types.${fact.mission_type}.title` as TranslationKey, {
              target: `${fact.target_value}`,
            }),
          }),
          rewards: [
            formatReward(t("glory"), fact.glory_reward, icons.glory({})),
            formatReward(t("qi_energy"), fact.qi_reward, icons.qi_energy({})),
            formatReward(t("qi_stone"), fact.qi_stone_reward, icons.stone({})),
            formatReward(t("spirit_cristal"), fact.spirit_cristal_reward, icons.crystal({})),
            formatReward(t("experience"), fact.exp_reward, icons.exp({})),
          ].filter(Boolean),
        };

      case FactsType.SPIRIT_PATH:
        return {
          icon: icons.spirit_path({ className: "text-yellow-400" }),
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          separator: "bg-yellow-500/20",
          title: t("facts.spirit_path_fact1", {
            time: `${fact.active_minutes} ${t("minutes")}`,
          }),
          rewards: [
            formatReward(t("facts.spirit_path_fact2"), fact.qi_reward, icons.qi_energy({})),
            formatReward(t("facts.spirit_path_fact3"), fact.spirit_cristal_reward, icons.crystal({})),
            formatReward(t("facts.spirit_path_fact4"), fact.exp_reward, icons.exp({})),
          ].filter(Boolean),
        };

      case FactsType.MINE:
        return {
          icon: icons.mine({ className: "text-blue-400" }),
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          separator: "bg-blue-500/20",
          title: t("facts.mine_fact1"),
          rewards: [
            formatReward(t("facts.mine_fact2"), fact.qi_stone_reward, icons.stone({})),
            formatReward(t("facts.mine_fact3"), fact.exp_reward, icons.exp({})),
          ].filter(Boolean),
        };

      default:
        return null;
    }
  })();

  const formattedDate = getLocalFormatedDate({ date: fact.createdAt, lang: language });

  if (!config) return null;

  return (
    <Card
      className={`border ${config.border} ${config.bg} backdrop-blur-sm text-foreground shadow-sm hover:shadow-md transition-all p-1 gap-2`}
    >
      <CardHeader className="flex flex-row items-center gap-3 p-1">
        {formattedDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            {icons.calendar({})}
            {formattedDate}
          </div>
        )}
      </CardHeader>

      <Separator className={config.separator} />

      {config.rewards.length > 0 && (
        <CardContent className="p-1 text-sm flex flex-col gap-3 justify-start flex-wrap">
          <div className="flex gap-2 items-center justify-start">
            <div className={`flex items-center  justify-center  min-w-10 h-10 rounded-md ${config.bg}`}>
              {config.icon}
            </div>
            <CardTitle className="text-sm font-medium leading-tight">{config.title}</CardTitle>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center">
            {config.rewards.map((reward, i) => (
              <div key={i} className="flex justify-center items-center gap-1">
                <span className="text-foreground/80">{reward!.text}</span>
                {reward!.icon}
              </div>
            ))}
          </div>
        </CardContent>
      )}
      {config.link && (
        <CardFooter className="p-1 text-sm flex w-full items-center  justify-start ">
          <Link className="px-4 py-2 border rounded-md text-center w-full" href={config.link}>
            {t("details")}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
