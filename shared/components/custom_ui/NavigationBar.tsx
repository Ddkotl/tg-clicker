"use client";

import Home from "../icons/Home";
import Leaderboard from "../icons/Leaderboard";
import Friends from "../icons/Friends";
import Earn from "../icons/Earn";
import Link from "next/link";
import Settings from "../icons/Settings";
import { useQuery } from "@tanstack/react-query";
import { getSessionQuery } from "@/querys/session_queries";
import { SessionErrorResponse, SessionResponse } from "@/app/api/session/route";

const NavigationBar = () => {
  const { data: session, isFetching } = useQuery<
    SessionResponse | SessionErrorResponse
  >({
    ...getSessionQuery(),
  });
  const tabs: {
    id: string;
    url: string;
    label: string;
    Icon: React.FC<{ className?: string }>;
  }[] = [
    { id: "home", url: "/game", label: "Главная", Icon: Home },
    {
      id: "friends",
      url: `profile/friends/${session?.data?.user ? session.data.user.userId : ""}`,
      label: "Почта",
      Icon: Friends,
    },
    {
      id: "tasks",
      url: `game/tasks/${session?.data?.user ? session.data.user.userId : ""}`,
      label: "Задания",
      Icon: Earn,
    },
    {
      id: "leaderboard",
      url: "game/leaderboard",
      label: "Рейтинги",
      Icon: Leaderboard,
    },
    {
      id: "settings",
      url: "game/settings",
      label: "Настройки",
      Icon: Settings,
    },
  ];

  return (
    <div className="flex justify-center w-full">
      <div className="fixed bottom-0 bg-background/90 border-t border-foreground/60 w-full max-w-md">
        <div className="flex justify-between px-4 py-2">
          {tabs.map((tab) => {
            return (
              <Link
                key={tab.id}
                href={tab.url}
                className={`flex flex-col items-center ${isFetching ? "pointer-events-none" : ""}`}
              >
                <tab.Icon className={`w-10 h-10 text-primary/70`} />
                <span className={`text-xs font-medium text-primary/70`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
