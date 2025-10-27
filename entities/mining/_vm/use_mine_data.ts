import { useEffect, useState } from "react";
import { useGetSessionQuery } from "@/entities/auth";
import { getMineInfoQuery } from "@/entities/mining/_queries/get_mine_info_query";
import { useQuery } from "@tanstack/react-query";
import { useGetMiningReward } from "../_mutations/use_get_mining_reward";
import { useCheckUserDeals } from "@/entities/user/_queries/use_check_user_deals";
import * as MiningConst from "@/shared/game_config/mining/mining_const";

export const useMineData = () => {
  const { data: session, isLoading: isSessionLoading } = useGetSessionQuery();
  const userId = session?.data?.user.userId;
  const deals = useCheckUserDeals();

  const {
    data: mine,
    isLoading,
    refetch,
  } = useQuery({
    ...getMineInfoQuery(userId ?? ""),
    enabled: !!userId,
  });

  const mutation = useGetMiningReward();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (mutation.isSuccess) {
      setNow(new Date());
    }
  }, [mutation.isSuccess, refetch]);

  const energy = mine?.data.energy ?? MiningConst.MAX_ENERGY;
  const percent = (energy / MiningConst.MAX_ENERGY) * 100;

  return {
    isLoading: isLoading || isSessionLoading,
    mine,
    userId,
    mutation,
    refetch,
    now,
    setNow,
    energy,
    percent,
    deals,
  };
};
