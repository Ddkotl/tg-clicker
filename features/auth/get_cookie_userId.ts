import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export function getCookieUserId({ headers }: { headers: ReadonlyHeaders }) {
  const lang = headers.get("x-user-id");
  return lang;
}
