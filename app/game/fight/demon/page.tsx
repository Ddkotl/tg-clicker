"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function DemonFightPage({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [fightData, setFightData] = useState<any>(null);

  const createFight = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/fight/create", { method: "POST", body: JSON.stringify({ userId }) });
      return res.json();
    },
    onSuccess: setFightData,
  });

  const attack = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/fight/attack", { method: "POST", body: JSON.stringify({ userId }) });
      return res.json();
    },
    onSuccess: setFightData,
  });

  return (
    <div className="p-4 space-y-4">
      <button className="btn" onClick={() => createFight.mutate()}>
        Следующий враг
      </button>
      <button className="btn" onClick={() => attack.mutate()}>
        Атаковать
      </button>

      {fightData && (
        <>
          <div>
            <h2>Игрок: {fightData.snapshot.player.name}</h2>
            <p>
              HP: {fightData.snapshot.player.currentHp}/{fightData.snapshot.player.maxHp}
            </p>
            <h2>Враг: {fightData.snapshot.enemy.name}</h2>
            <p>
              HP: {fightData.snapshot.enemy.currentHp}/{fightData.snapshot.enemy.maxHp}
            </p>
          </div>

          <div>
            <h3>Лог боя:</h3>
            <ul>
              {fightData.log.map((step: any, i: number) => (
                <li key={i}>
                  {step.text} (Урон: {step.damage})
                </li>
              ))}
            </ul>
          </div>

          {fightData.result === "WIN" && (
            <div className="text-green-500">Победа! Награды: {JSON.stringify(fightData.rewards)}</div>
          )}
          {fightData.result === "LOSE" && <div className="text-red-500">Проигрыш!</div>}
        </>
      )}
    </div>
  );
}
