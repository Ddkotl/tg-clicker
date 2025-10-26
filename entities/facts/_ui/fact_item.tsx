"use client";

import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Facts, FactsType } from "@/_generated/prisma";
import { TranslationKey } from "@/features/translations/translate_type";
import { useLanguage } from "@/features/translations/lang_context";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Droplet, HardHat, Hourglass, Pickaxe, Sparkles, Calendar } from "lucide-react";
import { getHoursString } from "@/entities/meditation/_vm/getHoursString";

export function FactItem({
  fact,
  t,
}: {
  fact: Facts;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const { language } = useLanguage();

  const config = (() => {
    switch (fact.type) {
      case FactsType.MEDITATION:
        return {
          color: "purple",
          icon: <Hourglass className="h-5 w-5 text-purple-400" />,
          bg: "bg-purple-500/10",
          border: "border-purple-500/30",
          separator: "bg-purple-500/20",
          title: t("facts.meditation_fact1", {
            time: `${fact.active_hours} ${t(`hour.${getHoursString(fact.active_hours ?? 0)}` as TranslationKey)}`,
          }),
          rewards: [
            {
              icon: <Droplet className="text-blue-400 h-4 w-4" />,
              text: `${t("facts.meditation_fact2")} ${fact.mana_reward ?? 0}`,
            },
            {
              icon: <HardHat className="text-amber-500 h-4 w-4" />,
              text: `${t("facts.meditation_fact3")} ${fact.exp_reward ?? 0}`,
            },
          ],
        };

      case FactsType.MINE:
        return {
          color: "blue",
          icon: <Pickaxe className="h-5 w-5 text-blue-400" />,
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          separator: "bg-blue-500/20",
          title: t("facts.mine_fact1"),
          rewards: [
            {
              icon: <Sparkles className="text-yellow-400 h-4 w-4" />,
              text: `${t("facts.mine_fact2")}: ${fact.gold_reward ?? 0}`,
            },
            {
              icon: <HardHat className="text-amber-500 h-4 w-4" />,
              text: `${t("facts.mine_fact3")}: ${fact.exp_reward ?? 0}`,
            },
          ],
        };

      default:
        return null;
    }
  })();

  const formattedDate = fact.createdAt
    ? format(fact.createdAt, "d MMMM yyyy, HH:mm", {
        locale: language === "ru" ? ru : enUS,
      })
    : "";

  return (
    <Card
      className={`border ${config?.border} ${config?.bg} backdrop-blur-sm text-foreground shadow-sm hover:shadow-md transition-all p-1 gap-2`}
    >
      <CardHeader className="flex flex-row items-center gap-3 p-1">
        {formattedDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </div>
        )}
      </CardHeader>

      <Separator className={config?.separator} />

      {config?.rewards?.length !== undefined && config?.rewards?.length > 0 && (
        <CardContent className="p-1 text-sm flex gap-3 items-center justify-start flex-wrap">
          <div className={`flex items-center justify-center w-10 h-10 rounded-md ${config?.bg}`}>{config?.icon}</div>

          <div className="flex-1">
            <CardTitle className="text-sm font-medium leading-tight">{config?.title}</CardTitle>
            <div className="flex gap-3">
              {config?.rewards.map((reward, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-foreground/80">{reward.text}</span>
                  {reward.icon}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
