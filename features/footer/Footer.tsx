"use client";

import { useGetSessionQuery } from "@/entities/auth";
import { useTranslation } from "@/features/translations/use_translation";
import { FooterItemType } from "./_domain/types";
import Home from "@/shared/components/icons/Home";
import Friends from "@/shared/components/icons/Friends";
import Earn from "@/shared/components/icons/Earn";
import Leaderboard from "@/shared/components/icons/Leaderboard";
import Settings from "@/shared/components/icons/Settings";
import { FooterItem } from "./_ui/footer_item";
import { ui_path } from "@/shared/lib/paths";
import { useMissionsQuery } from "@/entities/missions";
import { MissionTime } from "@/_generated/prisma/enums";

export function Footer() {
  const { t, language } = useTranslation();
  const { data: session, isLoading, isFetching } = useGetSessionQuery();
  const userId = session?.data?.user?.userId;
  const {
    data: missions,
    isLoading: isLoadingMissions,
    isFetching: isFetchingMissions,
  } = useMissionsQuery(userId || "");
  const missionList = missions?.data?.missions ?? [];
  const daily_missions = missionList.filter((e) => e.time === MissionTime.DAILY);
  const permanent_missions = missionList.filter((e) => e.time === MissionTime.PERMANENT && e.chanel_lang === language);
  const items: FooterItemType[] = [
    {
      id: "home",
      url: ui_path.home_page(),
      label: t("footer.home"),
      Icon: Home,
    },
    {
      id: "friends",
      url: ui_path.home_page(),
      label: t("footer.messages"),
      Icon: Friends,
      soon: t("soon"),
    },
    {
      id: "tasks",
      url: ui_path.missions_page(),
      label: t("footer.tasks"),
      Icon: Earn,
      count: daily_missions.length + permanent_missions.length,
    },
    {
      id: "leaderboard",
      url: ui_path.rankings_page(),
      label: t("footer.ratings"),
      Icon: Leaderboard,
    },
    {
      id: "settings",
      url: ui_path.home_page(),
      label: t("footer.settings"),
      Icon: Settings,
      soon: t("soon"),
    },
  ];
  const isDisabled = isLoading || isFetching || isLoadingMissions || isFetchingMissions;
  return (
    <div className="flex justify-center w-full">
      <div className="fixed bottom-0 bg-footer-gradient border-t border-foreground/60 w-full max-w-md">
        <div className="flex justify-between px-4 py-2">
          {items.map((item) => {
            return (
              <FooterItem
                key={item.id}
                soon={item.soon}
                item={item}
                count={item.count ? item.count : -1}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
