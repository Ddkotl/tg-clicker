"use client";
import { TabProvider } from "@/contexts/TabContext";
import { queryClient } from "@/utils/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {" "}
        <TabProvider>{children} </TabProvider>
      </QueryClientProvider>
    </>
  );
}
