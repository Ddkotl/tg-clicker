"use client";
import { useTranslation } from "@/features/translations/use_translation";
import { PageDescription } from "@/shared/components/custom_ui/page_description";
import { img_paths } from "@/shared/lib/img_paths";
import { NavItem, PageNav } from "@/shared/components/custom_ui/page_nav";
import { ui_path } from "@/shared/lib/paths";
import { icons } from "@/shared/lib/icons";

export function Headquarter() {
  const { t } = useTranslation();
  const nav_items: NavItem[] = [
    {
      label: t("headquarter.meditation"),
      href: ui_path.meditation_page(),
      icon: icons.meditation({}),
    },
    {
      label: t("headquarter.mine"),
      href: ui_path.mine_page(),
      icon: icons.mine({}),
    },
  ];
  return (
    <div className=" flex flex-col gap-4">
      <PageDescription
        title={t("home.navigation.headquarters")}
        text={t("headquarter.headquarter_welcome")}
        img={img_paths.temple()}
      />
      <PageNav nav_items={nav_items} />
    </div>
  );
}
