"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { CityDescription } from "./_ui/city_description";
import { NavItem, PageNav } from "@/shared/components/custom_ui/page_nav";
import { ui_path } from "@/shared/lib/paths";

export function City() {
  const { t } = useTranslation();
  const nav_items: NavItem[] = [
    {
      label: t("city.shop.shop"),
      href: ui_path.city_shop_page(),
    },
  ];

  return (
    <div className=" flex flex-col gap-4">
      <CityDescription t={t} />
      <PageNav nav_items={nav_items} />
    </div>
  );
}
