import { TranslateFn } from "@/features/translations/server/translate_fn";
import { NavItem } from "../components/custom_ui/page_nav";
import { icons } from "./icons";
import { ui_path } from "./paths";
import { SupportedLang } from "@/features/translations/translate_type";

export const nav_items = {
  headquarter_page_nav_items: (translate: TranslateFn, lang: SupportedLang): NavItem[] => [
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
  ],
};
