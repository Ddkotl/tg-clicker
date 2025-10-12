import { useState, useEffect } from "react";
import {
  CheckNicknameErrorResponseType,
  CheckNicknameResponseType,
} from "../_domain/types";

export function useNicknameValidation(nickname: string) {
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!nickname || nickname.length < 3) {
      setIsValid(null);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setIsChecking(true);
        const res = await fetch(
          `/api/user/check/nickname?nickname=${nickname}`,
          { signal: controller.signal },
        );
        const data: CheckNicknameResponseType | CheckNicknameErrorResponseType =
          await res.json();
        setIsValid(data.data?.available || false);
      } catch {
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    }, 700);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [nickname]);

  return { isChecking, isValid };
}
