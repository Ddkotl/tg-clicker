"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface AuthResponse {
  message: string;
  language_code?: string;
  nikname?: string;
  telegram_id: string;
}

export default function TelegramAuth() {
  const router = useRouter();

  const { isLoading, isError, data } = useQuery<AuthResponse, Error>({
    queryKey: ["telegramAuth"],
    queryFn: async () => {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.ready();
      const initData = WebApp.initData;

      if (!initData) {
        throw new Error("No initData from Telegram WebApp");
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
        cache: "no-store",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.message || "Authentication failed");
      }

      return res.json();
    },
    retry: 2,
    staleTime: 2 * 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
  useEffect(() => {
    console.log(data);
    if (data && data.nikname && data.language_code) {
      router.push("/game");
    } else {
      router.push("/registration");
    }
  }, [data, router]);
  if (isLoading) {
    return <Image src="/loading.jpg" width={300} height={300} alt="загрузка" />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8 text-red-500">
        <p>Произошла ошибка аутентификации</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Перезагрузить
        </button>
      </div>
    );
  }

  return null;
}
