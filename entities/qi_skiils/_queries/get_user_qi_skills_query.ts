import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export const getUserQiSkillsQuery = (userId: string) => ({
  queryKey: queries_keys.qi_skills_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(api_path.get_user_qi_skills(userId), { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch userQiSkills");
    }
    return res.json();
  },
});
