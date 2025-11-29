"use client";

import { TelegramAuthLoading } from "./telegram_auth_loading";
import { TelegramAuthError } from "./telegram_auth_error";
import { useTelegramAuth } from "../_vm/useTelegramAuth";

export function TelegramAuth() {
  const { isError } = useTelegramAuth();
  if (isError) return <TelegramAuthError />;
  return <TelegramAuthLoading />;
}
