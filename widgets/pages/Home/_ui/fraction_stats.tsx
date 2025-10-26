"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Users } from "lucide-react";

interface FactionConfrontationBarProps {
  dataFractionCounts?:
    | {
        data: {
          adepts: number;
          novices: number;
        };
        message: string;
      }
    | undefined;
  className?: string;
  isLoading?: boolean;
}

export function FactionConfrontationBar({
  dataFractionCounts,
  className = "",
  isLoading,
}: FactionConfrontationBarProps) {
  if (isLoading) {
    return (
      <div className={`relative w-full max-w-md mx-auto h-6 rounded-full ${className}`}>
        <Skeleton className="absolute inset-0 rounded-full" />

        <div className="absolute inset-0 flex justify-between items-center px-3">
          <Skeleton className="w-8 h-4 rounded" />
          <Skeleton className="w-8 h-4 rounded" />
        </div>
      </div>
    );
  }

  if (!dataFractionCounts?.data) return null;

  const { adepts, novices } = dataFractionCounts.data;
  const total = adepts + novices || 1;

  const novicesPercent = (novices / total) * 100;
  const adeptsPercent = 100 - novicesPercent;

  return (
    <div
      className={`relative w-full max-w-md mx-auto h-6 rounded-full overflow-hidden border border-border shadow-sm ${className}`}
    >
      <div
        className={`
          absolute right-0 top-0 h-full transition-all duration-500 ease-in-out 
          bg-gradient-to-r from-red-700 to-red-500
        `}
        style={{ width: `${adeptsPercent}%` }}
      />
      <div
        className={`
          absolute left-0 top-0 h-full transition-all duration-500 ease-in-out 
          bg-gradient-to-l from-blue-700 to-blue-400
        `}
        style={{ width: `${novicesPercent}%` }}
      />

      <div className="absolute inset-0 flex justify-between items-center px-3 text-white text-xs font-semibold drop-shadow-sm">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 opacity-90" />
          <span>{adepts.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{novices.toLocaleString()}</span>
          <Users className="w-3 h-3 opacity-90" />
        </div>
      </div>
    </div>
  );
}
