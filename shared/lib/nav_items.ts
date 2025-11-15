import { TranslateFn } from "@/features/translations/server/translate_fn";
import { NavItem } from "../components/custom_ui/page_nav";
import { icons } from "./icons";
import { ui_path } from "./paths";
import { SupportedLang } from "@/features/translations/translate_type";

export const nav_items = {
  headquarter_page_nav_items: (translate: TranslateFn, lang: SupportedLang): NavItem[] => [
    {
      label: translate("headquarter.missions.title", lang),
      href: ui_path.missions_page(),
      icon: icons.missions({}),
    },
    {
      label: translate("headquarter.meditation", lang),
      href: ui_path.meditation_page(),
      icon: icons.meditation({}),
    },
    {
      label: translate("headquarter.mine", lang),
      href: ui_path.mine_page(),
      icon: icons.mine({ className: "text-white/80" }),
    },
    {
      label: translate("headquarter.spirit_path.title", lang),
      href: ui_path.spirit_path_page(),
      icon: icons.spirit_path({}),
    },
    {
      label: translate("headquarter.qi_skills.title", lang),
      href: ui_path.qi_skills_page(),
      icon: icons.qi_skills({}),
    },
  ],
  city_nav_items: (translate: TranslateFn, lang: SupportedLang): NavItem[] => [
    {
      label: translate("city.shop.shop", lang),
      href: ui_path.city_shop_page(),
    },
  ],
  home_nav_items: (translate: TranslateFn, lang: SupportedLang): NavItem[] => [
    {
      label: `${translate("home.navigation.chronicles", lang)}`,
      href: ui_path.facts_page(),
      icon: icons.fact({}),
    },
    {
      label: `${translate("home.navigation.battle", lang)}`,
      href: ui_path.fight_page(),
      icon: icons.fight({}),
    },
    {
      label: `${translate("home.navigation.headquarters", lang)}`,
      href: ui_path.headquarter_page(),
      icon: icons.temple({}),
    },
    {
      label: `${translate("home.navigation.city", lang)}`,
      href: ui_path.city_page(),
      icon: icons.citadel({}),
    },
    {
      label: `${translate("home.navigation.agent", lang)}`,
      href: ui_path.pet_page(),
      icon: icons.pet({}),
    },
    {
      label: `${translate("home.navigation.rating", lang)}`,
      href: ui_path.rankings_page(),
      icon: icons.trophy({ className: "h-10 w-10 " }),
    },
  ],
  fight_nav_items: (translate: TranslateFn, lang: SupportedLang): NavItem[] => [
    {
      label: translate("fight.oponents.demonic_beasts", lang),
      href: ui_path.city_shop_page(),
    },
  ],
};
