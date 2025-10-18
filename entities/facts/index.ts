export {
  factErrorResponseSchema,
  factResponseSchema,
  factSchema,
} from "./_domain/schemas";
export type { FactErrorResponseType, FactResponseType } from "./_domain/types";
export { getFactsQuery, useInvalidateFacts } from "./_queries/facts_query";
