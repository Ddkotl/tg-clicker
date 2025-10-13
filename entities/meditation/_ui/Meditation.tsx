"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { MeditationForm } from "./meditation-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TranslationKey } from "@/features/translations/translate_type";
import { getHoursString } from "./getHoursString";
import { useState } from "react";

export function Meditation() {
  const [selectedHours, setSelectedHours] = useState("1");
  const { t } = useTranslation();
  return (
    <div className=" flex flex-col gap-3">
      <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-2">
          <CardTitle className="text-primary text-lg font-bold">
            {t("headquarter.meditation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          <span className="text-primary text-md font-bold">{t("mentor")} </span>
          <span>{t("headquarter.meditation_desc")}</span>
          <p>
            {t("headquarter.meditation_revard_promise", {
              mana: "11111",
              time: `1 ${t(`hour.${getHoursString(+selectedHours)}` as TranslationKey)}`,
            })}
          </p>
        </CardContent>
      </Card>
      <MeditationForm onTimeChange={setSelectedHours} />
    </div>
  );
}
