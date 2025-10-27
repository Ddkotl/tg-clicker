"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { MainButton } from "@/shared/components/custom_ui/main-button";
import { HomeNavItemType } from "../_domain/types";
import { icons } from "@/shared/lib/icons";

export function HomeNav({ t }: { t: (key: TranslationKey, vars?: Record<string, string | number>) => string }) {
  const home_nav_items: HomeNavItemType[] = [
    { label: `${t("home.navigation.chronicles")}`, href: "/game/facts", icon: icons.fact({}) },
    { label: `${t("home.navigation.battle")}`, href: "/game/battle", icon: icons.fight({}) },
    {
      label: `${t("home.navigation.headquarters")}`,
      href: "/game/headquarter",
      icon: icons.temple({}),
    },
    { label: `${t("home.navigation.city")}`, href: "/game/city", icon: icons.citadel({}) },
    { label: `${t("home.navigation.agent")}`, href: "/game/agent", icon: icons.pet({}) },
    { label: `${t("home.navigation.rating")}`, href: "/game/ranking", icon: icons.trophy({ className: "h-10 w-10 " }) },
  ];
  return (
    <div className={`grid grid-cols-2 gap-2 transition-opacity duration-200 `}>
      {home_nav_items.map((item) => (
        <MainButton key={item.href} href={item.href} label={item.label} icon={item.icon} />
      ))}
    </div>
  );
}
