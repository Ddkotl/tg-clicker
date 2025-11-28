"use client";
import { useGetSessionQuery } from "@/entities/auth";
import { useQuery } from "@tanstack/react-query";
import { QiSkillKey, QiSkillsConfig } from "@/shared/game_config/qi_skills/qi_skills";
import { getUserQiSkillsQuery } from "../_queries/get_user_qi_skills_query";
import { GetUserQiSkillsResponseType } from "../_domain/types";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useUpdateQiSkillMutation } from "../_mutations/use_update_qi_skill_mutation";
import { useProfileQuery } from "@/entities/profile";
import { QiSkillItem } from "./qi_skill_item";
import { useTranslation } from "@/features/translations/use_translation";
import { TranslationKey } from "@/features/translations/translate_type";
import { img_paths } from "@/shared/lib/img_paths";

export function QiSkillsList() {
  const { t } = useTranslation();
  const session = useGetSessionQuery();
  const userId = session.data?.data?.user.userId;
  const profile = useProfileQuery(userId || "");

  const { data: skills, isLoading } = useQuery<GetUserQiSkillsResponseType>({
    ...getUserQiSkillsQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useUpdateQiSkillMutation();

  if (profile.isLoading || profile.data?.data?.spirit_cristal === undefined || isLoading || !userId)
    return <ComponentSpinner />;
  if (!skills) return null;

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(QiSkillsConfig).map(([key, config]) => {
        const typedKey = key as QiSkillKey;
        const level = skills.data[typedKey];
        const upgradeCost = config.calcUpgradeCost(level);

        return (
          <QiSkillItem
            key={key}
            userId={userId}
            name={t(`headquarter.qi_skills.${key}.name` as TranslationKey)}
            description={t(`headquarter.qi_skills.${key}.description` as TranslationKey)}
            current_effect={t(`headquarter.qi_skills.${key}.current_effect` as TranslationKey)}
            next_effect={t(`headquarter.qi_skills.${key}.next_effect` as TranslationKey)}
            level={level}
            maxLevel={config.maxLevel}
            upgradeCost={upgradeCost}
            userCristal={profile.data?.data?.spirit_cristal ?? 0}
            onUpgrade={() => mutation.mutate({ skill: typedKey, userId })}
            isUpgrading={mutation.isPending}
            iconSrc={img_paths.qi_skills_list[typedKey]()}
            skillKey={typedKey}
          />
        );
      })}
    </div>
  );
}
