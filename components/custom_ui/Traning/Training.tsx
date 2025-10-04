"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileQuery } from "@/querys/profile_queries";
import { getUserProfileByUserIdType } from "@/repositories/user_repository";
import { TrainingParam } from "./TrainingParam";
import { updateUserParamType } from "@/repositories/update_user_param";
import { PARAMS } from "@/config/params_cost";
import { Profile } from "@/_generated/prisma";

export function Training() {
  const queryClient = useQueryClient();
  const params = useParams<{ userId: string }>();
  const { data: profile, isLoading } = useQuery<getUserProfileByUserIdType>({
    ...getProfileQuery(params.userId),
  });

  const mutation = useMutation({
    mutationFn: async (paramName: string) => {
      const res = await fetch("/api/user/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramName }),
      });
      if (!res.ok) throw new Error("Не удалось обновить параметр");
      return res.json();
    },
    onSuccess: (data: updateUserParamType) => {
      queryClient.setQueryData(["profile", params.userId], data);
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
      title: "Сила",
      description: "Увеличивает урон",
      icon: "/adept_m.jpg",
    },
    {
      name: "protection",
      title: "Защита",
      description: "Уменьшает получаемый урон",
      icon: "/adept_m.jpg",
    },
    {
      name: "speed",
      title: "Скорость",
      description: "Увеличивает шанс уклонения",
      icon: "/adept_m.jpg",
    },
    {
      name: "skill",
      title: "Навык",
      description: "Увеличивает шанс критического удара",
      icon: "/adept_m.jpg",
    },
    {
      name: "qi",
      title: "Ци",
      description: "Дает превосходство в бою",
      icon: "/adept_m.jpg",
    },
  ];
  if (isLoading) return <p>Загрузка...</p>;
  if (!profile?.profile) return <p>Профиль не найден</p>;
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Тренировка</h1>

      <div className="space-y-4">
        {trainingParams.map((param) => (
          <TrainingParam
            key={param.name}
            title={param.title}
            description={param.description}
            icon={param.icon}
            value={profile.profile?.[param.name as keyof Profile] as number}
            paramName={param.name}
            onUpgrade={handleUpgrade}
            hero_mana={profile.profile?.mana as number}
          />
        ))}
      </div>
    </div>
  );
}
