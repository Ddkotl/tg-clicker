"use client";

import { getHoursString } from "@/entities/meditation/_vm/getHoursString";
import { TranslationKey } from "@/features/translations/translate_type";
import { Droplet, HardHat, Hourglass, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ru, enUS } from "date-fns/locale";
import { Facts } from "@/_generated/prisma";
import { useLanguage } from "@/features/translations/lang_context";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

export function MeditationFact({
  fact,
  t,
}: {
  fact: Facts;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const { language } = useLanguage();
  const formattedDate = fact.createdAt
    ? format(new Date(fact.createdAt), "d MMMM yyyy, HH:mm", {
        locale: language === "ru" ? ru : enUS,
      })
    : "";

  return (
    <Card className="border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm text-foreground shadow-sm hover:shadow-md transition-all p-1 gap-1">
      <CardHeader className="flex flex-row items-center gap-3 p-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-purple-500/10">
          <Hourglass className="h-5 w-5 text-purple-400" />
        </div>

        <div className="flex-1">
          <CardTitle className="text-sm font-medium leading-tight">
            {t("facts.meditation_fact1", {
              time: `${fact.active_hours} ${t(`hour.${getHoursString(fact.active_hours ?? 0)}` as TranslationKey)}`,
            })}
          </CardTitle>

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          )}
        </div>
      </CardHeader>

      <Separator className="bg-purple-500/20" />

      <CardContent className="p-1  text-sm flex gap-2 items-center justify-start">
        <div className="flex items-center gap-2">
          <Droplet className="text-blue-400 h-4 w-4" />
          <span className="text-foreground/80">
            {fact.mana_reward ?? 0} {t("facts.meditation_fact2")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HardHat className="text-amber-500 h-4 w-4" />
          <span className="text-foreground/80">
            {fact.exp_reward ?? 0} {t("facts.meditation_fact3")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
