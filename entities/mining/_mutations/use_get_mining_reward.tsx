import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetMineResponseType, MiningRequestType, MiningResponseType } from "../_domain/types";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { GetActionTokenResponseType } from "@/entities/auth";
import { toast } from "sonner";
import { queries_keys } from "@/shared/lib/queries_keys";
import { ProfileResponse } from "@/entities/profile";
import { api_path } from "@/shared/lib/paths";
import { pageSize } from "@/shared/game_config/facts/facts_const";
import { useTranslation } from "@/features/translations/use_translation";
import { icons } from "@/shared/lib/icons";

export function useGetMiningReward() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<MiningResponseType, ErrorResponseType, MiningRequestType>({
    mutationFn: async (data) => {
      const tokenRes = await fetch(api_path.get_action_token());
      const json: GetActionTokenResponseType = await tokenRes.json();
      if (!tokenRes.ok) throw json;

      const res = await fetch(api_path.mining_gold(), {
        method: "POST",
        headers: { "Content-Type": "application/json", "action-token": `Bearer ${json.data.action_token}` },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(data.data.userId), (old) => {
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
      queryClient.setQueryData<GetMineResponseType>(queries_keys.mine_userId(data.data.userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            energy: data.data.energy,
            last_energy_at: data.data.last_energy_at ?? Date.now(),
            last_mine_at: data.data.last_mine_at ?? Date.now(),
          },
        };
      });
      queryClient.invalidateQueries({ queryKey: queries_keys.facts_userId(data.data.userId) });
      queryClient.invalidateQueries({ queryKey: [...queries_keys.facts_userId(data.data.userId), pageSize] });
      toast.success(t("facts.mine_fact1"), {
        description: (
          <div className=" w-full flex gap-4">
            <span className="flex items-center gap-1">
              {t("facts.mine_fact2")}: {data.data.gold_reward}
              {icons.stone({})}
            </span>
            <span className="flex items-center gap-1">
              {t("facts.mine_fact3")}: {data.data.exp_reward}
              {icons.exp({})}
            </span>
          </div>
        ),
        position: "bottom-center",
        duration: 5000,
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });
}
