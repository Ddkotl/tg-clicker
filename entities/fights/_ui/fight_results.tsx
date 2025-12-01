"use client";

import { ComponentSpinner } from "@/shared/components/custom_ui/component_spinner";
import { useGetFightQuery } from "../_queries/use_get_fight_query";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { FightLog, FightResRewards, FightResLossesSchema } from "../_domain/types";
import { Flame, Shield, Swords, Heart } from "lucide-react";
import { formatFightResult } from "../_vm/format_fight_result";

export function FightResults({ fightId }: { fightId: string }) {
  const { data: fight, isLoading } = useGetFightQuery({ fightId });

  if (isLoading) return <ComponentSpinner />;

  const f = fight?.data;

  const log = (f?.fightLog as FightLog) ?? [];

  const formatted = formatFightResult({
    result: f?.result ?? null,
    log,
    rewards: f?.rewards as FightResRewards,
    losses: f?.loses as FightResLossesSchema,
    attackerName: "Ты",
    enemyName: f?.enemyType === "DEMONIC_BEAST" ? "Монстр" : "Противник",
  });

  const resultText = formatted.result === "WIN" ? "Победа!" : formatted.result === "LOSE" ? "Поражение!" : "Ничья!";

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl p-4 border-[1.5px]">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-4xl font-extrabold flex justify-center items-center gap-3">
          {formatted.result === "WIN" && <Swords className="text-green-500 h-9 w-9" />}
          {formatted.result === "LOSE" && <Shield className="text-red-500 h-9 w-9" />}
          {formatted.result === "DRAW" && <Flame className="text-yellow-500 h-9 w-9" />}

          {resultText}

          <Badge
            className={cn(
              "text-md px-4 py-1 rounded-md",
              formatted.result === "WIN" && "bg-green-600",
              formatted.result === "LOSE" && "bg-red-600",
              formatted.result === "DRAW" && "bg-yellow-500",
            )}
          >
            {formatted.result}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-7">
        {/* Причина результата */}
        <div
          className={cn(
            "p-3 rounded-md text-center text-lg font-semibold",
            formatted.result === "WIN" && "bg-green-500/15 text-green-700",
            formatted.result === "LOSE" && "bg-red-500/15 text-red-700",
            formatted.result === "DRAW" && "bg-yellow-500/15 text-yellow-700",
          )}
        >
          {formatted.reason}
        </div>

        <Separator />

        {/* НАГРАДЫ */}
        <Block title="Награды">
          {formatted.rewards ? (
            <div className="grid grid-cols-2 gap-3">
              {formatted.rewards.split(", ").map((reward, idx) => {
                const [key, value] = reward.split(": ");
                return (
                  <div key={idx} className="flex justify-between px-3 py-2 rounded-md bg-muted/40">
                    <span className="text-muted-foreground capitalize">{key}</span>
                    <span className="font-bold">{value}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Без наград</p>
          )}
        </Block>

        <Separator />

        {/* ПОТЕРИ */}
        {formatted.losses && (
          <>
            <Block title="Потери">
              <div className="grid grid-cols-2 gap-3">
                {formatted.losses.split(", ").map((loss, idx) => {
                  const [key, value] = loss.split(": ");
                  return (
                    <div key={idx} className="flex justify-between px-3 py-2 rounded-md bg-red-500/10">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-bold text-red-700">{value}</span>
                    </div>
                  );
                })}
              </div>
            </Block>

            <Separator />
          </>
        )}

        {/* ДАМАГ */}
        <Block title="Нанесённый урон">
          <StatRow label="Ты" value={formatted?.dmg?.["Ты"] ?? 0} className="text-green-600" />
          <StatRow label={"Противник"} value={formatted?.dmg?.["Противник"] ?? 0} className="text-red-600" />
        </Block>

        <Separator />

        {/* ХП */}
        <Block title="Остаток здоровья">
          <StatRow label="Ты" value={formatted?.hp?.["Ты"] ?? 0} className="text-green-600" />
          <StatRow label={"Противник"} value={0} className="text-red-600" />
        </Block>

        <Separator />

        {/* ЛОГИ БОЯ */}
        <Block title="Ход боя">
          <div className="space-y-2 max-h-64 overflow-y-auto bg-muted/20 p-3 rounded-md border">
            {log.length > 0 ? (
              log.map((entry, i) => (
                <div key={i} className="text-sm text-muted-foreground leading-snug">
                  • {entry.text}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm">Лог пуст</p>
            )}
          </div>
        </Block>

        {/* КНОПКА */}
        <div className="flex justify-end pt-2">
          <Button className="px-6 py-2 text-lg font-semibold">Следующий</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ==========================
   Вспомогательные компоненты
========================== */

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-2xl mb-3 flex items-center gap-2">
        <Heart className="h-5 w-5 text-muted-foreground" /> {title}
      </h3>
      {children}
    </div>
  );
}

function StatRow({ label, value, className }: { label: string; value: number | string; className?: string }) {
  return (
    <div className="flex justify-between px-3 py-2 rounded-md bg-muted/30">
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn("font-bold", className)}>{value}</span>
    </div>
  );
}
