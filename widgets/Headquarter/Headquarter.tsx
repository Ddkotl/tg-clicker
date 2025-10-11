"use client";
import { MainButton } from "@/components/custom_ui/main-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use_translation";

export function Headquarter() {
  const { t } = useTranslation();
  const hedquartersMenu = [
    {
      label: t("headquarter.meditation"),
      href: `/game/headquarter/meditation`,
    },
  ];
  return (
    <div className=" flex flex-col gap-4">
      <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
        <CardHeader className="px-2">
          <CardTitle className="text-primary text-lg font-bold">
            {t("headquarter.headquarter_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          <span className="text-primary text-md font-bold">{t("mentor")} </span>
          <span>{t("headquarter.headquarter_welcome")}</span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {hedquartersMenu.map((item) => (
          <MainButton key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
