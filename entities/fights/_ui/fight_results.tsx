"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useGetFightQuery } from "../_queries/use_get_fight_query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { FightLog, FightResRewards } from "../_domain/types";

export function FightResults({ fightId }: { fightId: string }) {
  const { data: fight, isLoading } = useGetFightQuery({ fightId });

  if (isLoading) return <ComponentSpinner />;

  if (!fight?.ok || !fight.data) {
    return (
      <Card className="p-6">
        <CardTitle>Ошибка</CardTitle>
        <p className="text-red-500 mt-2">{fight?.message || "Произошла ошибка"}</p>
      </Card>
    );
  }

  const f = fight.data;
  const log = f.fightLog as FightLog;

  // ============================
  //   1) СУММА УРОНА
  // ============================
  const totalPlayerDmg = log.filter((e) => e.attacker === "player").reduce((acc, e) => acc + e.damage, 0);

  const totalEnemyDmg = log.filter((e) => e.attacker === "enemy").reduce((acc, e) => acc + e.damage, 0);

  // ============================
  //   2) ОСТАТОК HP
  // ============================
  const lastTick = log[log.length - 1];
  const playerHpLeft = lastTick ? lastTick.defenderHpAfter : null;
  const enemyHpLeft = lastTick ? lastTick.attackerHpAfter : null;

  const resultText = f.result === "WIN" ? "Победа!" : f.result === "LOSE" ? "Поражение!" : "Ничья!";

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg p-4">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center gap-4">
          {resultText}
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
        {/* =======================
            ПРИЧИНА ПОБЕДЫ / ПОРАЖЕНИЯ
        ======================== */}
        <div className="p-3 rounded-md bg-muted/40">
          {f.result === "WIN" && (
            <p className="text-green-600 font-semibold">Ты победил противника и доказал своё превосходство!</p>
          )}

          {f.result === "LOSE" && (
            <p className="text-red-600 font-semibold">Причина: У тебя осталось {playerHpLeft} здоровья.</p>
          )}

          {f.result === "DRAW" && <p className="text-gray-600 font-semibold">Бой завершился вничью.</p>}
        </div>

        <Separator />

        {/* =======================
            НАГРАДЫ
        ======================== */}
        <div>
          <h3 className="font-semibold text-xl mb-3">Награды</h3>

          {f.rewards && typeof f.rewards === "object" ? (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(f.rewards as FightResRewards).map(([key, value]) =>
                value ? (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-bold">{value}</span>
                  </div>
                ) : null,
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Без наград</p>
          )}
        </div>

        <Separator />

        {/* =======================
            УРОН
        ======================== */}
        <div>
          <h3 className="font-semibold text-xl mb-3">Нанесённый урон</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ты:</span>
              <span className="font-bold">{totalPlayerDmg}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Противник:</span>
              <span className="font-bold">{totalEnemyDmg}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* =======================
            ОСТАТОК HP
        ======================== */}
        <div>
          <h3 className="font-semibold text-xl mb-3">Остаток здоровья</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ты:</span>
              <span className="font-bold">{playerHpLeft}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Противник:</span>
              <span className="font-bold">{enemyHpLeft}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* =======================
            ЛОГИ БОЯ
        ======================== */}
        <div>
          <h3 className="font-semibold text-xl mb-3">Ход боя</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto bg-muted/20 p-3 rounded-md">
            {log.map((entry, i) => (
              <div key={i} className="text-sm text-muted-foreground leading-snug">
                • {entry.text}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* =======================
            КНОПКА "СЛЕДУЮЩИЙ"
        ======================== */}
        <div className="flex justify-end">
          <Button className="px-6 py-2 text-lg">Следующий</Button>
        </div>
      </CardContent>
    </Card>
  );
}
