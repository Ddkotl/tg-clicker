"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { MainButton } from "@/shared/components/custom_ui/main-button";
import { HeadquarterNavItem } from "../_domain/types";

export function HeadquarterNav({ t }: { t: (key: TranslationKey, vars?: Record<string, string | number>) => string }) {
  const hedquartersMenuItems: HeadquarterNavItem[] = [
    {
      label: t("headquarter.meditation"),
      href: `/game/headquarter/meditation`,
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {hedquartersMenuItems.map((item) => (
        <MainButton key={item.href} label={item.label} href={item.href} />
      ))}
    </div>
  );
}
