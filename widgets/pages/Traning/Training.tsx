"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery } from "@/entities/profile/_queries/profile_query";
import { TrainingParam } from "./TrainingParam";
import { Profile } from "@/_generated/prisma";

import { useTranslation } from "@/features/translations/use_translation";
import { ProfileErrorResponse, ProfileResponse } from "@/entities/profile";
import { GenerateParamsConfig } from "@/shared/game_config/params/params_cost";
import { useTrainParamMutation } from "@/entities/profile/_mutations/use_train_param_mutation";

export function Training() {
  const { t, language } = useTranslation();
  const params = useParams<{ userId: string }>();
  const { data: profile, isLoading: isLoadingProfile } = useQuery<ProfileResponse, ProfileErrorResponse>({
    ...getProfileQuery(params.userId),
  });

  const mutation = useTrainParamMutation(params.userId);

  const handleUpgrade = (paramName: string) => {
    mutation.mutate(paramName);
  };

  const trainingParams = Object.values(GenerateParamsConfig({ lang: language }));
  if (isLoadingProfile) return <p>{t("loading")}</p>;
  if (!profile?.data) return <p>{t("error")}</p>;
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">{t("training.title")}</h1>

      <div className="space-y-4">
        {trainingParams.map((param) => (
          <TrainingParam
            key={param.name}
            title={param.title ?? param.name}
            description={param.description ?? param.name}
            icon={param.icon ?? ""}
            value={profile.data?.[param.name as keyof Profile] as number}
            paramName={param.name}
            onUpgrade={handleUpgrade}
            hero_qi={profile.data?.qi as number}
            isPending={mutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
