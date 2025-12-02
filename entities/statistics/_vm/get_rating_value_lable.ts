import { SupportedLang } from "@/features/translations/translate_type";
import { ratingMetrics, RatingsMetrics, RatingsTypes, ratingsTypes } from "../_domain/types";
import { translate } from "@/features/translations/server/translate_fn";

export function getRatingValueLable({
  metric,
  type,
  language,
}: {
  metric: RatingsMetrics;
  type: RatingsTypes;
  language: SupportedLang;
}) {
  return metric === ratingMetrics.exp && type !== ratingsTypes.overall
    ? translate("experience", language)
    : translate(`ranking.ratings.names_types.${metric}_value`, language);
}
