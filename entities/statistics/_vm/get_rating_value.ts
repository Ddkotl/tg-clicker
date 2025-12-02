import { ratingMetrics, RatingsMetrics } from "../_domain/types";
import { getLevelByExp } from "@/shared/game_config/exp/get_lvl_by_exp";

export function getRatingValue({ metric, amount }: { metric: RatingsMetrics; amount: number }) {
  return metric === ratingMetrics.exp ? getLevelByExp(amount) : amount;
}
