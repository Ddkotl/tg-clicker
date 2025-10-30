import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetMeditationRewardRequestType, GetMeditationRewardResponseType } from "../_domain/types";
import { queries_keys } from "@/shared/lib/queries_keys";
import { pageSize } from "@/shared/game_config/facts/facts_const";
import { ProfileResponse } from "@/entities/profile";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { toast } from "sonner";
import { useTranslation } from "@/features/translations/use_translation";
import { getHoursString } from "../_vm/getHoursString";
import { TranslationKey } from "@/features/translations/translate_type";
import { icons } from "@/shared/lib/icons";

export function useGetMeditationReward() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<GetMeditationRewardResponseType, ErrorResponseType, GetMeditationRewardRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.get_meditation_revard(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      return json;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(queries_keys.profile_userId(data.data.userId), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            lvl: data.data.current_lvl,
            exp: data.data.current_exp,
            spirit_cristal: data.data.current_spirit_cristal,
            qi: data.data.current_qi,
          },
        };
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.meditation_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.facts_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: [...queries_keys.facts_userId(data.data.userId), pageSize],
      });
      toast.success(
        t("facts.meditation_fact1", {
          time: `${data.data.hours} ${t(`hour.${getHoursString(data.data.hours)}` as TranslationKey)}`,
        }),
        {
          description: (
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                {t("facts.meditation_fact2")}: {data.data.reward_qi}
                {icons.qi_energy({})}
              </span>
              <span className="flex items-center gap-1">
                {t("facts.meditation_fact3")}: {data.data.reward_exp}
                {icons.exp({})}
              </span>
            </div>
          ),
          position: "bottom-center",
        },
      );
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });
}
