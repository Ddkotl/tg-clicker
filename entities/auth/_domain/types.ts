import z from "zod";
import {
  authRequestSchema,
  authResponseSchema,
  checkNicknameerrorResponseSchema,
  checkNicknameResponseSchema,
  errorResponseSchema,
  errorSessionResponseSchema,
  registrationErrorResponseSchema,
  registrationRequestSchema,
  registrationResponseSchema,
  sessionResponseSchema,
} from "./schemas";

export type AuthResponseType = z.infer<typeof authResponseSchema>;

export type AuthErrorResponseType = z.infer<typeof errorResponseSchema>;

export type AuthRequestType = z.infer<typeof authRequestSchema>;

export type SessionResponseType = z.infer<typeof sessionResponseSchema>;
export type SessionErrorResponseType = z.infer<
  typeof errorSessionResponseSchema
>;

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

export type CheckNicknameResponseType = z.infer<
  typeof checkNicknameResponseSchema
>;
export type CheckNicknameErrorResponseType = z.infer<
  typeof checkNicknameerrorResponseSchema
>;
export type RegistrationResponseType = z.infer<
  typeof registrationResponseSchema
>;
export type RegistrationErrorResponseType = z.infer<
  typeof registrationErrorResponseSchema
>;
export type RegistrationRequestType = z.infer<typeof registrationRequestSchema>;
