import z from "zod";
import {
  authRequestSchema,
  authResponseSchema,
  errorResponseSchema,
} from "./schemas";

export type AuthResponseType = z.infer<typeof authResponseSchema>;

export type AuthErrorResponseType = z.infer<typeof errorResponseSchema>;

export type AuthRequestType = z.infer<typeof authRequestSchema>;

export type CreateUserType = {
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
  photo_url?: string;
  allows_write_to_pm?: boolean;
  auth_date?: string;
};
