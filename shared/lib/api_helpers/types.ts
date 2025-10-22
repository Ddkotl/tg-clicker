import z from "zod";
import { errorResponseSchema } from "./schemas";

export type ErrorResponseType = z.infer<typeof errorResponseSchema>;
