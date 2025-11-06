"use client";
import { useGetSessionQuery } from "@/entities/auth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { QiSkillKey, QiSkillsConfig } from "@/shared/game_config/qi_skills/qi_skills";
import { useQuery } from "@tanstack/react-query";
import { getUserQiSkillsQuery } from "../_queries/get_user_qi_skills_query";
import { GetUserQiSkillsResponseType } from "../_domain/types";
import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useUpdateQiSkillMutation } from "../_mutations/use_update_qi_skill_mutation";
import { useTranslation } from "@/features/translations/use_translation";
import { TranslationKey } from "@/features/translations/translate_type";

export function QiSkillsList() {
  const { t } = useTranslation();
  const session = useGetSessionQuery();
  const userId = session.data?.data?.user.userId;

  const { data: skills, isLoading } = useQuery<GetUserQiSkillsResponseType>({
    ...getUserQiSkillsQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useUpdateQiSkillMutation();

  if (isLoading || !userId) return <ComponentSpinner />;
  if (!skills) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {Object.entries(QiSkillsConfig).map(([key, config]) => {
        const typedKey = key as QiSkillKey;
        const level = skills.data[typedKey];
        const max = config.maxLevel;
        const progress = (level / max) * 100;
        const cost = config.calcUpgradeCost(level);

        return (
          <Card key={key} className="border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {t(`headquarter.qi_skills.${key}.name` as TranslationKey)}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {t(`headquarter.qi_skills.${key}.description` as TranslationKey)}
              </div>

              <Progress value={progress} />

              <div className="text-sm">
                {t("lvl")}:<b> {level}</b> / {max}
              </div>

              <div className="text-sm">
                {t("upgrade_cost")}: <b>{cost}</b> {t("qi_energy")}
              </div>

              <Button
                disabled={level >= max || mutation.isPending}
                onClick={() => mutation.mutate({ skill: typedKey, userId })}
                className="w-full"
              >
                {t("upgrade_button")}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
