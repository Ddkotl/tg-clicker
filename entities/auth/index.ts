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
  GetActionTokenResponseType,
  RegistrationRequestType,
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
  getActionTokenResponseSchema,
} from "./_domain/schemas";

export { TelegramAuth } from "./_ui/TelegramAuth";
export { useAuthQuery } from "./_queries/auth_query";
export { useGetSessionQuery } from "./_queries/session_queries";
