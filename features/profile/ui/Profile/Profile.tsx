"use client";

import { useTranslation } from "@/features/translations/use_translation";
import { useProfileQuery } from "@/entities/profile/_queries/use_profile_query";
import { lvl_exp } from "@/shared/game_config/exp/lvl_exp";
import { ProfileHeader } from "./profile_header";
import { ProfileNav } from "./profile_nav";
import { useGetSessionQuery } from "@/entities/auth";
import { getLevelByExp } from "@/shared/game_config/exp/get_lvl_by_exp";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { DisplayPlayerOnline } from "@/entities/profile/_ui/DisplayPlayerOnline";
import { ProfileAvatar } from "@/entities/profile/_ui/ProfileAvatar";
import { Title } from "@/shared/components/custom_ui/title";
import { Separator } from "@/shared/components/ui/separator";
import { img_paths } from "@/shared/lib/img_paths";
import { ProfileParam } from "./ProfileParam";
import { icons } from "@/shared/lib/icons";

export function Profile({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();
  const { data: profile, isLoading } = useProfileQuery(userId);

  const user = profile?.data;
  const exp = user?.exp ?? 0;
  const lvl = getLevelByExp(exp);
  const nextExp = lvl_exp[lvl + 1];

  const isMyProfile = session?.data?.user.userId === userId;

  if (isLoading || isLoadingSession) {
    return <ComponentSpinner />;
  }

  if (!user || !user.last_online_at) {
    return <div>{t("profile.not_found")}</div>;
  }

  const params = [
    { img: img_paths.params_training.power(), text: t("training.power"), value: user.power },
    { img: img_paths.params_training.protection(), text: t("training.protection"), value: user.protection },
    { img: img_paths.params_training.speed(), text: t("training.speed"), value: user.speed },
    { img: img_paths.params_training.skill(), text: t("training.skill"), value: user.skill },
    { img: img_paths.params_training.qi_param(), text: t("training.qi_param"), value: user.qi_param },
  ];

  return (
    <div className="flex flex-col gap-3">
      <ProfileHeader
        profile_avatar={
          <ProfileAvatar avatarUrl={user.avatar_url || ""} nickname={user.nikname || ""} className="w-24 h-24" />
        }
        title={<Title text={user.nikname || ""} align="left" size="xl" />}
        online={<DisplayPlayerOnline date={user.last_online_at} t={t} />}
        playerMotto={user.player_motto}
        fraktion={user.fraktion}
      />

      <Separator />
      <ProfileParam className="ml-1" label={t("lvl")} value={user.lvl} icon={icons.lvl} />
      <ProfileParam className="ml-1" label={t("glory")} value={user.glory} icon={icons.glory} />
      <ProfileParam className="ml-1" label={t("experience")} value={`${user.exp} / ${nextExp}`} icon={icons.exp} />
      <ProfileParam
        label={t("max_hp")}
        value={`${user.current_hitpoint} / ${user.max_hitpoint}`}
        imgSrc={img_paths.params_training.max_hp()}
      />
      <Title text={t("params")} align="center" size="md" />

      <div className="flex flex-col gap-2 text-center">
        {params.map((st, idx) => (
          <ProfileParam key={idx} label={st.text} value={st.value} imgSrc={st.img} />
        ))}
      </div>

      <ProfileNav isMyProfile={isMyProfile} userId={user.userId} isLoading={isLoading} />
    </div>
  );
}
