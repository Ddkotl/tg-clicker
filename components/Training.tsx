"use client";

import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileByTgIdType } from "@/repositories/user_repository";

type StatType = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const stats: StatType[] = [
  {
    id: "power",
    title: "Атака",
    description: "Определяет урон, наносимый противнику.",
    icon: "/power.jpg",
  },
  {
    id: "protection",
    title: "Защита",
    description: "Определяет урон, который ты можешь заблокировать.",
    icon: "/protection.jpg",
  },
  {
    id: "speed",
    title: "Скорость",
    description: "Определяет вероятность уворота от удара.",
    icon: "/speed.jpg",
  },
  {
    id: "skill",
    title: "Точность",
    description: "Определяет вероятность нанесения критического удара.",
    icon: "/skill.jpg",
  },
];

export function Training() {
  const params = useParams<{ userId: string }>();

  const { data, isLoading } = useQuery<getUserProfileByTgIdType>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("api/user/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">Тренировка</h1>

      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center gap-4 p-3 rounded-xl border shadow-sm bg-card"
          >
            {/* Иконка */}
            <Image
              src={stat.icon}
              alt={stat.title}
              width={55}
              height={55}
              className="rounded-md"
            />

            {/* Инфо */}
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold">{stat.title}</h4>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>

              <div className="flex justify-between text-xs">
                <span>Уровень: 111</span>
                <span className="text-muted-foreground">
                  Цена:{" "}
                  <span className="inline-flex items-center gap-1">
                    <Image
                      src="/assets/silver.png"
                      alt="silver"
                      width={16}
                      height={16}
                    />
                    111111
                  </span>
                </span>
              </div>

              <Progress value={77} className="h-2" />

              <Button
                size="sm"
                className="w-full bg-primary/70"
                onClick={() => console.log("Улучшить", stat.id)}
              >
                Улучшить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
