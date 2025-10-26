import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "@/features/translations/use_translation";
import { goMeditationRequestType, goMeditationResponseType } from "../_domain/types";
import { getHoursString } from "../_vm/getHoursString";
import { TranslationKey } from "@/features/translations/translate_type";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";

export function useGoMeditationMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<goMeditationResponseType, ErrorResponseType, goMeditationRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.go_meditation(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw json;
      return json;
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
          {
            position: "bottom-center",
          },
        );
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });
}
