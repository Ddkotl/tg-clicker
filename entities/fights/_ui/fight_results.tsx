"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useGetFightQuery } from "../_queries/use_get_fight_query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import { FightLog, FightResRewards } from "../_domain/types";

export function FightResults({ fightId }: { fightId: string }) {
  const { data: fight, isLoading } = useGetFightQuery({ fightId });

  if (isLoading) {
    return <ComponentSpinner />;
  }

  if (!fight?.ok || !fight.data) {
    return (
      <Card className="p-6">
        <CardTitle>Ошибка</CardTitle>
        <p className="text-red-500 mt-2">{fight?.message || "Произошла ошибка"}</p>
      </Card>
    );
  }

  const f = fight.data;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          Результат боя
          <Badge
            className={cn(
              "text-sm px-3 py-1",
              f.result === "WIN" && "bg-green-600",
              f.result === "LOSE" && "bg-red-600",
              f.result === "DRAW" && "bg-gray-600",
            )}
          >
            {f.result}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Тип боя */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Тип боя:</span>
          <span className="font-medium">{f.type}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Противник:</span>
          <span className="font-medium">{f.enemyType}</span>
        </div>

        <Separator />

        {/* Награды */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Награды</h3>
          {typeof f.rewards === "object" ? (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(f.rewards as FightResRewards).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Нет наград</p>
          )}
        </div>

        <Separator />

        {/* Логи */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Ход боя</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 rounded-md bg-muted/30">
            {Array.isArray(f.fightLog) ? (
              (f.fightLog as FightLog).map((log, i) => (
                <div key={i} className="text-sm text-muted-foreground">
                  • {typeof log === "string" ? log : JSON.stringify(log)}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Нет данных</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
