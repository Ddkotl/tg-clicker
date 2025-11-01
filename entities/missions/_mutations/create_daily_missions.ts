import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "@/features/translations/use_translation";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { CreateDailyMissionsResponseType, GetDailyMissionsRequestType } from "../_domain/types";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useCreateDailyMissionMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<CreateDailyMissionsResponseType, ErrorResponseType, GetDailyMissionsRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.create_daily_missions(data.userId), {
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
        queryKey: queries_keys.daily_missions_userId(data.data.userId),
      });

      if (data) {
        toast.success(t("facts.notification.new_missions"), {
          position: "bottom-center",
        });
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    },
  });
}
