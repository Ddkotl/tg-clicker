"use client";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/lang_context";
import { ThemeProvider } from "@/contexts/theme_context";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </QueryClientProvider>
    </>
  );
}
