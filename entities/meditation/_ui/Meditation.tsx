"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useTranslation } from "@/features/translations/use_translation";
import { MeditationForm } from "./meditation-form";

export function Meditation() {
  const { t } = useTranslation();
  return (
    <div className=" flex flex-col gap-4">
      <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-2">
          <CardTitle className="text-primary text-lg font-bold">
            {t("headquarter.meditation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          <span className="text-primary text-md font-bold">{t("mentor")} </span>
          <span>{t("headquarter.meditation_desc")}</span>
          <p>{t("headquarter.meditation_revard_promise", { mana: "11111" })}</p>
        </CardContent>
      </Card>
      <MeditationForm />
    </div>
  );
}
