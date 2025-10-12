export type {
  AuthErrorResponseType,
  AuthRequestType,
  AuthResponseType,
  CreateUserType,
  CheckNicknameErrorResponseType,
  CheckNicknameResponseType,
  SessionErrorResponseType,
  SessionResponseType,
  RegistrationErrorResponseType,
  RegistrationResponseType,
} from "./_domain/types";

export {
  authRequestSchema,
  authResponseSchema,
  errorResponseSchema,
  checkNicknameRequestSchema,
  checkNicknameResponseSchema,
  checkNicknameerrorResponseSchema,
  errorSessionResponseSchema,
  sessionResponseSchema,
  registrationErrorResponseSchema,
  registrationRequestSchema,
  registrationResponseSchema,
} from "./_domain/schemas";

export { TelegramAuth } from "./_ui/TelegramAuth";
export { useAuthQuery } from "./_queries/auth_query";
export {
  useGetSessionQuery,
  useInvalidateGetSessionQuery,
} from "./_queries/session_queries";
