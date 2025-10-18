"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function FactsDescription({
  t,
}: {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  return (
    <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
      <CardHeader className="px-2">
        <CardTitle className="text-primary text-lg font-bold">
          {t("facts.fact_title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
        <span>{t("facts.fact_description")}</span>
      </CardContent>
    </Card>
  );
}
