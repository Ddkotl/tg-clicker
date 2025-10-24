import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetMineResponseType, MiningRequestType, MiningResponseType } from "../_domain/types";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { GetActionTokenResponseType } from "@/entities/auth";
import { toast } from "sonner";
import { queries_keys } from "@/shared/lib/queries_keys";
import { ProfileResponse } from "@/entities/profile";
import { api_path } from "@/shared/lib/paths";

export function useGetMiningReward() {
  const queryClient = useQueryClient();

  return useMutation<MiningResponseType, ErrorResponseType, MiningRequestType>({
    mutationFn: async (data) => {
      const tokenRes = await fetch(api_path.get_action_token());
      if (!tokenRes.ok) throw new Error("No action token");
      const ok_res: GetActionTokenResponseType = await tokenRes.json();

      const res = await fetch(api_path.mining_gold(), {
        method: "POST",
        headers: { "Content-Type": "application/json", "action-token": `Bearer ${ok_res.data.action_token}` },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(queries_keys.mine_userId(data.data.userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            lvl: data.data.lvl,
            gold: data.data.gold_reward + old.data.gold,
            exp: data.data.exp_reward + old.data.exp,
          },
        };
      });
      queryClient.setQueryData<GetMineResponseType>(queries_keys.profile_userId(data.data.userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            energy: data.data.energy,
            last_energy_at: data.data.last_energy_at,
            last_mine_at: data.data.last_mine_at,
          },
        };
      });
      toast.success(`⛏️ Вы добыли ${data.data.gold_reward} камней и ${data.data.exp_reward} опыта!`);
    },
    onError: (err) => {
      toast.error(err.message ?? "Ошибка при добыче");
    },
  });
}
