"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

async function fetchProfile(userId: string) {
  const res = await fetch(`/api/fight/status?userId=${encodeURIComponent(userId)}`);
  return res.json();
}

async function startFight(userId: string) {
  const res = await fetch("/api/fight/pve/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export default function PveShadowFight({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["fight_status", userId], () => fetchProfile(userId));

  const [lastResult, setLastResult] = useState<any>(null);

  const mutation = useMutation(() => startFight(userId), {
    onSuccess: (data) => {
      // refresh profile and show fight result
      queryClient.invalidateQueries(["fight_status", userId]);
      setLastResult(data);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data?.ok) return <div>Error: {data?.reason ?? "No profile"}</div>;

  const profile = data.profile;
  const nextChargeMs = profile.last_charge_recovery
    ? new Date(profile.last_charge_recovery).getTime() + 30 * 60 * 1000 - Date.now()
    : 0;

  const minutes = nextChargeMs > 0 ? Math.ceil(nextChargeMs / 60000) : 0;

  return (
    <div className="p-4 rounded border">
      <h3 className="text-lg font-bold">Бой с Тенью</h3>

      <p>Зарядов: {profile.fight_charges} / 30</p>
      <p>Следующий заряд через: {minutes} мин</p>

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isLoading || profile.fight_charges <= 0}
        className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {mutation.isLoading ? "Сражение..." : "Начать бой с тенью"}
      </button>

      {lastResult && (
        <div className="mt-4">
          {lastResult.ok ? (
            <div>
              <p>Результат: {lastResult.result}</p>
              {lastResult.rewards && (
                <div>
                  <p>Награды:</p>
                  <ul>
                    <li>exp: {lastResult.rewards.exp}</li>
                    <li>qi: {lastResult.rewards.qi}</li>
                    <li>qi_stone: {lastResult.rewards.qi_stone}</li>
                    <li>glory: {lastResult.rewards.glory}</li>
                  </ul>
                </div>
              )}
              <details>
                <summary>Log</summary>
                <pre style={{ maxHeight: 200, overflow: "auto" }}>{JSON.stringify(lastResult.fightLog, null, 2)}</pre>
              </details>
            </div>
          ) : (
            <p className="text-red-500">Ошибка: {lastResult.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}
