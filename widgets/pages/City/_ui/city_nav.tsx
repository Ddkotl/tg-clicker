"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { MainButton } from "@/shared/components/custom_ui/main-button";
import { CityNavItem } from "../_domain/types";
import { ui_path } from "@/shared/lib/paths";

export function CityNav({
  t,
}: {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const cityMenuItems: CityNavItem[] = [
    {
      label: t("city.shop.shop"),
      href: ui_path.city_shop_page(),
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {cityMenuItems.map((item) => (
        <MainButton key={item.href} label={item.label} href={item.href} />
      ))}
    </div>
  );
}
