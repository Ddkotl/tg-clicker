"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/features/themes/theme_context";
import { Fraktion, Gender } from "@/_generated/prisma";

import { getProfileQuery } from "@/entities/profile/_queries/profile_query";
import { useGetSessionQuery } from "@/entities/auth/_queries/session_queries";
import { ProfileResponse } from "@/entities/profile";

export function useRegistration() {
  const { theme, setTheme } = useTheme();
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [fraktion, setFraktion] = useState<Fraktion>(Fraktion.ADEPT);
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  const { data: session, isLoading: isLoadingSession } = useGetSessionQuery();

  const { data: profile, isLoading: isLoadingProfile } = useQuery<ProfileResponse>({
    ...getProfileQuery(session?.data?.user.userId || ""),
    enabled: !!session?.data?.user.userId,
  });

  useEffect(() => {
    if (profile) {
      setNickname(profile?.data?.nikname || "");
      setFraktion(profile.data?.fraktion || Fraktion.ADEPT);
      setGender(profile.data?.gender || Gender.MALE);
      setUserId(profile.data?.userId || "");
    }
  }, [profile]);

  return {
    userId,
    nickname,
    setNickname,
    fraktion,
    setFraktion,
    gender,
    setGender,
    theme,
    setTheme,
    isLoading: isLoadingProfile || isLoadingSession,
  };
}
