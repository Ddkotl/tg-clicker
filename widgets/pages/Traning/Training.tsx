"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery } from "@/entities/profile/_queries/profile_query";
import { TrainingParam } from "./TrainingParam";
import { Profile } from "@/_generated/prisma";

import { useTranslation } from "@/features/translations/use_translation";
import { ProfileErrorResponse, ProfileResponse } from "@/entities/profile";
import { PARAMS } from "@/shared/game_config/params_cost";
import { useTrainParamMutation } from "@/entities/profile/_mutations/use_train_param_mutation";

export function Training() {
  const { t } = useTranslation();
  const params = useParams<{ userId: string }>();
  const { data: profile, isLoading: isLoadingProfile } = useQuery<ProfileResponse, ProfileErrorResponse>({
    ...getProfileQuery(params.userId),
  });

  const mutation = useTrainParamMutation(params.userId);

  const handleUpgrade = (paramName: string) => {
    mutation.mutate(paramName);
  };

  type ProfileKeys = keyof typeof PARAMS;

  const trainingParams: {
    name: ProfileKeys;
    title: string;
    description: string;
    icon: string;
  }[] = [
    {
      name: "power",
      title: `${t("training.power")}`,
      description: `${t("training.power_desc")}`,
      icon: "/power.png",
    },
    {
      name: "protection",
      title: `${t("training.protection")}`,
      description: `${t("training.protection_desc")}`,
      icon: "/protection.png",
    },
    {
      name: "speed",
      title: `${t("training.speed")}`,
      description: `${t("training.speed_desc")}`,
      icon: "/speed.png",
    },
    {
      name: "skill",
      title: `${t("training.skill")}`,
      description: `${t("training.skill_desc")}`,
      icon: "/skill.png",
    },
    {
      name: "qi",
      title: `${t("training.qi")}`,
      description: `${t("training.qi_desc")}`,
      icon: "/qi.png",
    },
  ];
  if (isLoadingProfile) return <p>{t("loading")}</p>;
  if (!profile?.data) return <p>{t("error")}</p>;
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">{t("training.title")}</h1>

      <div className="space-y-4">
        {trainingParams.map((param) => (
          <TrainingParam
            key={param.name}
            title={param.title}
            description={param.description}
            icon={param.icon}
            value={profile.data?.[param.name as keyof Profile] as number}
            paramName={param.name}
            onUpgrade={handleUpgrade}
            hero_mana={profile.data?.mana as number}
            isPending={mutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
