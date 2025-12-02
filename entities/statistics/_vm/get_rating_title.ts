import { SupportedLang } from "@/features/translations/translate_type";
import { ratingMetrics, RatingsMetrics, ratingsTypes, RatingsTypes } from "../_domain/types";
import { translate } from "@/features/translations/server/translate_fn";

export function getRatingTitle({
  metric,
  type,
  language,
}: {
  metric: RatingsMetrics;
  type: RatingsTypes;
  language: SupportedLang;
}) {
  return metric === ratingMetrics.exp && type !== ratingsTypes.overall
    ? translate(`ranking.ratings.names_types.exp_partial`, language)
    : translate(`ranking.ratings.names_types.${metric}`, language);
}
