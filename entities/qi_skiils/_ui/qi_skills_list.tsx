"use client";
import { useGetSessionQuery } from "@/entities/auth";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { queryClient } from "@/shared/connect/query-client";
import { QiSkillKey, QiSkillsConfig } from "@/shared/game_config/qi_skills/qi_skills";
import { useQuery, useMutation } from "@tanstack/react-query";

export function QiSkillsList() {
  const session = useGetSessionQuery();
  const userId = session.data?.data?.user.userId;
  const { data: skills } = useQuery({
    queryKey: ["user_qi_skills", userId],
    queryFn: () => fetch(`/api/user/qi_skills/${userId}`).then((r) => r.json()),
    enabled: !!userId,
  });
  console.log(skills);
  const mutation = useMutation({
    mutationFn: async (skill: QiSkillKey) => {
      return fetch(`/api/user/qi_skills/${userId}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill }),
      }).then((r) => r.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_qi_skills", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] }); // обновляем ЦИ
    },
  });

  if (!skills) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {Object.entries(QiSkillsConfig).map(([key, config]) => {
        const level = skills[key];
        const max = config.maxLevel;
        const progress = (level / max) * 100;
        const cost = config.calcUpgradeCost(level);

        return (
          <Card key={key} className="border rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{config.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">{config.description}</div>

              <Progress value={progress} />
              <div className="text-sm">
                Уровень: <b>{level}</b> / {max}
              </div>
              <div className="text-sm">
                Стоимость улучшения: <b>{cost}</b> Ци
              </div>

              <Button
                disabled={level >= max || mutation.isPending}
                onClick={() => mutation.mutate(key as QiSkillKey)}
                className="w-full"
              >
                Улучшить
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
