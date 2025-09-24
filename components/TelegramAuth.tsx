"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function TelegramAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAndAuth = async () => {
      try {
        // const sessionRes = await fetch("/api/session", { cache: "no-store" });
        // if (sessionRes.ok) {
        //   router.push("/game");
        //   return;
        // }
        const { default: WebApp } = await import("@twa-dev/sdk");
        WebApp.ready();
        const initData = WebApp.initData;
        if (initData) {
          const authRes = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
            cache: "no-store",
          });

          if (authRes.ok) {
            router.push("/game");
            return;
          } else {
            setError("Authentication failed");
          }
        } else {
          setError("No initData from Telegram WebApp");
        }
      } catch (e) {
        console.error("Auth flow failed:", e);
        setError("Unexpected error during authentication");
      } finally {
        setLoading(false);
      }
    };

    checkAndAuth();
  }, [router]);

  if (loading) {
    return <Image src="/loading.jpg" width={300} height={300} alt="ззагрузка" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 p-8 text-red-500">
        <p>Произошла ошибка аутентификации</p>
        <button
          onClick={() => router.refresh()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Перезагрузить
        </button>
      </div>
    );
  }

  return null;
}
