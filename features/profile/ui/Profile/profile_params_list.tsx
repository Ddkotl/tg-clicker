import { icons } from "@/shared/lib/icons";
import { ProfileParam } from "./profile_param";
import { TranslationKey } from "@/features/translations/translate_type";
import { img_paths } from "@/shared/lib/img_paths";
import { Profile } from "@/_generated/prisma";
import { getLevelByExp } from "@/shared/game_config/exp/get_lvl_by_exp";
import { lvl_exp } from "@/shared/game_config/exp/lvl_exp";

export function ProfileParamsList({
  user,
  t,
}: {
  user: Profile;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}) {
  const exp = user?.exp ?? 0;
  const lvl = getLevelByExp(exp);
  const nextExp = lvl_exp[lvl + 1];
  const params = [
    { icon: icons.lvl, text: t("lvl"), value: user.lvl },
    { icon: icons.glory, text: t("glory"), value: user.glory },
    { icon: icons.exp, text: t("experience"), value: `${user.exp} / ${nextExp}` },
    {
      img: img_paths.params_training.max_hp(),
      text: t("max_hp"),
      value: `${user.current_hitpoint} / ${user.max_hitpoint}`,
    },
    { img: img_paths.params_training.power(), text: t("training.power"), value: user.power },
    { img: img_paths.params_training.protection(), text: t("training.protection"), value: user.protection },
    { img: img_paths.params_training.speed(), text: t("training.speed"), value: user.speed },
    { img: img_paths.params_training.skill(), text: t("training.skill"), value: user.skill },
    { img: img_paths.params_training.qi_param(), text: t("training.qi_param"), value: user.qi_param },
  ];
  return (
    <div className="flex flex-col gap-1 text-center">
      {params.map((st, idx) => (
        <ProfileParam key={idx} label={st.text} value={st.value} imgSrc={st.img} icon={st.icon} />
      ))}
    </div>
  );
}
