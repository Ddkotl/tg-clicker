"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProfileQuery } from "@/querys/profile_queries";
import { getUserProfileByUserIdType } from "@/repositories/user_repository";
import { TrainingParam } from "./TrainingParam";

export function Training() {
  const params = useParams<{ userId: string }>();
  const { data, isLoading } = useQuery<getUserProfileByUserIdType>({
    ...getProfileQuery(params.userId),
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (!data?.profile) return <p>Профиль не найден</p>;

  const profile = data.profile;

  const handleUpgrade = (paramName: string) => {
    console.log(`Улучшить ${paramName}`);
    // Здесь можно вызвать API для повышения параметра
  };

  const trainingParams = [
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
            value={profile[param.name as keyof typeof profile] as number}
            paramName={param.name}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>
    </div>
  );
}
