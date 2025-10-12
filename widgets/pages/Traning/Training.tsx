"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileQuery } from "@/entities/profile/_queries/profile_query";
import { TrainingParam } from "./TrainingParam";
import { PARAMS } from "@/config/params_cost";
import { Profile } from "@/_generated/prisma";
import {
  ProfileErrorResponse,
  ProfileResponse,
} from "@/app/api/user/profile/route";
import { TrainErrorResponse, TrainResponse } from "@/app/api/user/train/route";
import { useTranslation } from "@/features/translations/use_translation";

export function Training() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const params = useParams<{ userId: string }>();
  const { data: profile, isLoading: isLoadingProfile } = useQuery<
    ProfileResponse | ProfileErrorResponse
  >({
    ...getProfileQuery(params.userId),
  });

  const mutation = useMutation<
    TrainResponse | TrainErrorResponse,
    Error,
    string
  >({
    mutationFn: async (paramName: string) => {
      const res = await fetch(`/api/user/train?userId=${params.userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramName }),
      });
      if (!res.ok) throw new Error("Не удалось обновить параметр");
      return res.json();
    },
    onSuccess: (data) => {
      if (
        "data" in data &&
        data.data?.paramName &&
        data.data?.newValue !== undefined
      ) {
        const { paramName, newValue } = data.data;

        queryClient.setQueryData<ProfileResponse>(
          ["profile", params.userId],
          (old) => {
            if (!old?.data) return old;

            return {
              ...old,
              data: {
                ...old.data,
                [paramName as keyof typeof old.data]: newValue,
                mana:
                  typeof data.data?.mana === "number"
                    ? data.data.mana
                    : old.data.mana,
              },
            };
          },
        );
      }
    },
  });

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
      icon: "/adept_m.jpg",
    },
    {
      name: "speed",
      title: `${t("training.speed")}`,
      description: `${t("training.speed_desc")}`,
      icon: "/adept_m.jpg",
    },
    {
      name: "skill",
      title: `${t("training.skill")}`,
      description: `${t("training.skill_desc")}`,
      icon: "/adept_m.jpg",
    },
    {
      name: "qi",
      title: `${t("training.qi")}`,
      description: `${t("training.qi_desc")}`,
      icon: "/adept_m.jpg",
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
          />
        ))}
      </div>
    </div>
  );
}
