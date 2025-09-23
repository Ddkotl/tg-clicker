"use client";

import { useTab } from "@/contexts/TabContext";
import HomeTab from "./HomeTab";
import LeaderboardTab from "./LeaderboardTab";
import FriendsTab from "./FriendsTab";
import TasksTab from "./TasksTab";

const TabContainer = () => {
  const { activeTab } = useTab();
  return (
    <div className="flex-1 overflow-hidden max-w-md mx-auto flex flex-col gap-4  px-2  py-[82px] ">
      <div className={`${activeTab === "home" ? "is-show" : "is-hide"}`}>
        <HomeTab />
      </div>
      <div className={`${activeTab === "leaderboard" ? "is-show" : "is-hide"}`}>
        <LeaderboardTab />
      </div>
      <div className={`${activeTab === "friends" ? "is-show" : "is-hide"}`}>
        <FriendsTab />
      </div>
      <div className={`${activeTab === "earn" ? "is-show" : "is-hide"}`}>
        <TasksTab />
      </div>
    </div>
  );
};

export default TabContainer;
