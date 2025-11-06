import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserQiSkillRequestType, UpdateUserQiSkillsResponseType } from "../_domain/types";
import { ErrorResponseType } from "@/shared/lib/api_helpers/types";
import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export function useUpdateQiSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserQiSkillsResponseType,
    ErrorResponseType,
    UpdateUserQiSkillRequestType & { userId: string }
  >({
    mutationFn: async (data) => {
      const res = await fetch(api_path.upgrade_user_qi_skills(data.userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) throw payload;
      return payload;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries_keys.qi_skills_userId(data.data.skills.userId) });
      queryClient.invalidateQueries({ queryKey: queries_keys.profile_userId(data.data.skills.userId) });
    },
  });
}
