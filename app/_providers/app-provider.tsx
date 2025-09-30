"use client";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/lang_context";
import { ThemeProvider } from "@/contexts/theme_context";
import { useTelegramBack } from "@/hooks/use_telegram_back";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

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
