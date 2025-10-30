import { useTranslation } from "@/features/translations/use_translation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GoSpiritPathRequestType, GoSpiritPathResponseType } from "../_domain/types";
import { api_path } from "@/shared/lib/paths";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { queries_keys } from "@/shared/lib/queries_keys";
import { toast } from "sonner";

export function useGoSpiritPathMutation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation<GoSpiritPathResponseType, ErrorResponseType, GoSpiritPathRequestType>({
    mutationFn: async (data) => {
      const res = await fetch(api_path.go_spirit_path(), {
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
        queryKey: queries_keys.profile_userId(data.data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queries_keys.spirit_path_userId(data.data.userId),
      });

      if (data.data?.spirit_paths_minutes) {
        toast.success(
          t("headquarter.spirit_path.go_sperit_path_message", {
            time: data.data.spirit_paths_minutes + " " + t("minutes"),
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
