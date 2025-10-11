import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use_translation";
import {
  goMeditationErrorResponseType,
  goMeditationRequestType,
  goMeditationResponseType,
} from "../_domain/types";
import { getHoursString } from "../_ui/getHoursString";

export function useGoMeditation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<
    goMeditationResponseType | goMeditationErrorResponseType,
    Error,
    goMeditationRequestType
  >({
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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["meditation"] });

      if (data.data?.meditation_hours) {
        toast(
          t("headquarter.meditation_went_message", {
            time: `${data.data.meditation_hours} ${t(
              `hour.${getHoursString(data.data.meditation_hours)}`,
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
