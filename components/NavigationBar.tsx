"use client";

import Home from "./icons/Home";
import Leaderboard from "./icons/Leaderboard";
import Friends from "./icons/Friends";
import Earn from "./icons/Earn";
import Link from "next/link";

const NavigationBar = () => {
  const tabs: { id: string; url: string; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: "home", url: "/game", label: "Главная", Icon: Home },
    { id: "leaderboard", url: "#", label: "Рейтинги", Icon: Leaderboard },
    { id: "friends", url: "#", label: "Почта", Icon: Friends },
    { id: "earn", url: "#", label: "Задания", Icon: Earn },
  ];

  return (
    <div className="flex justify-center w-full">
      <div className="fixed bottom-0 bg-background/90 border-t border-foreground/60 w-full max-w-md">
        <div className="flex justify-between px-4 py-2">
          {tabs.map((tab) => {
            return (
              <Link key={tab.id} href={tab.url} className={`flex flex-col items-center`}>
                <tab.Icon className={`w-10 h-10 text-foreground/60`} />
                <span className={`text-xs font-medium text-foreground/60`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
