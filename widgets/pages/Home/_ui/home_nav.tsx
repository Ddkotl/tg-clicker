"use client";

import { TranslationKey } from "@/features/translations/translate_type";
import { MainButton } from "@/shared/components/custom_ui/main-button";
import { HomeNavItemType } from "../_domain/types";

export function HomeNav({
  t,
}: {
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const home_nav_items: HomeNavItemType[] = [
    { label: `📜 ${t("home.navigation.chronicles")}`, href: "/game/facts" },
    { label: `⚔️ ${t("home.navigation.battle")}`, href: "/game/battle" },
    {
      label: `🏰 ${t("home.navigation.headquarters")}`,
      href: "/game/headquarter",
    },
    { label: `🌆 ${t("home.navigation.city")}`, href: "/game/city" },
    { label: `🕵️ ${t("home.navigation.secret_agent")}`, href: "/game/agent" },
    { label: `🏆 ${t("home.navigation.rating")}`, href: "/game/ranking" },
  ];
  return (
    <div className={`grid grid-cols-2 gap-3 transition-opacity duration-200 `}>
      {home_nav_items.map((item) => (
        <MainButton key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  );
}
