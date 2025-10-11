"use client";
import { LanguageProvider } from "@/features/translations/lang_context";
import { ThemeProvider } from "@/features/themes/theme_context";
import { useTelegramBack } from "@/features/telegram_back_button/use_telegram_back";
import { queryClient } from "@/shared/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/shared/components/ui/sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  useTelegramBack();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
