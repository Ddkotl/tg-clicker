"use client";

import { useTab } from "@/contexts/TabContext";
import { TabType } from "@/types/tab_type";
import Home from "./icons/Home";
import Leaderboard from "./icons/Leaderboard";
import Friends from "./icons/Friends";
import Earn from "./icons/Earn";

const NavigationBar = () => {
  const { activeTab, setActiveTab } = useTab();

  const tabs: { id: TabType; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: "home", label: "Главная", Icon: Home },
    { id: "leaderboard", label: "Рейтинги", Icon: Leaderboard },
    { id: "friends", label: "Почта", Icon: Friends },
    { id: "earn", label: "Задания", Icon: Earn },
  ];

  return (
    <div className="flex justify-center w-full">
      <div className="fixed bottom-0 bg-background/90 border-t border-foreground/60 w-full max-w-md">
        <div className="flex justify-between px-4 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center`}>
                <tab.Icon className={`w-10 h-10 ${isActive ? "text-[#4c9ce2]" : "text-foreground/60"}`} />
                <span className={`text-xs font-medium ${isActive ? "text-[#4c9ce2]" : "text-foreground/60"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
