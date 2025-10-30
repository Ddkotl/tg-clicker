import { api_path } from "@/shared/lib/paths";
import { queries_keys } from "@/shared/lib/queries_keys";

export const getSpiritPathInfoQuery = (userId: string) => ({
  queryKey: queries_keys.spirit_path_userId(userId),
  queryFn: async ({ signal }: { signal: AbortSignal }) => {
    const res = await fetch(api_path.get_spirit_path_info(userId), { signal });
    if (!res.ok) {
      throw new Error("Failed to fetch spirit_path info");
    }
    return res.json();
  },
});
