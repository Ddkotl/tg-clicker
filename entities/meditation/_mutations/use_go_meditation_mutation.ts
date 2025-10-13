import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "@/features/translations/use_translation";
import {
  goMeditationRequestType,
  goMeditationResponseType,
} from "../_domain/types";
import { getHoursString } from "../_ui/getHoursString";
import { TranslationKey } from "@/features/translations/translate_type";

export function useGoMeditationMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<goMeditationResponseType, Error, goMeditationRequestType>({
    mutationFn: async (data) => {
      const res = await fetch("/api/headquarter/meditation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Ошибка медитации");
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", data.data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meditation", data.data.userId],
      });

      if (data.data?.meditation_hours) {
        toast.success(
          t("headquarter.meditation_went_message", {
            time: `${data.data.meditation_hours} ${t(
              `hour.${getHoursString(data.data.meditation_hours)}` as TranslationKey,
            )}`,
          }),
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось начать медитацию");
    },
  });
}
