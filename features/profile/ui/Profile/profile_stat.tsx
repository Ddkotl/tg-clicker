"use client";
import { Progress } from "@/shared/components/ui/progress";

interface ProfileStatProps {
  label: string;
  value: string;
  progress: number;
  extra?: string;
}

export function ProfileStat({ label, value, progress, extra }: ProfileStatProps) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium">
        <span>
          {label} {value}
        </span>
        {extra && <span className="text-muted-foreground">({extra})</span>}
      </div>
      <Progress value={progress} className="h-2 mt-1" />
    </div>
  );
}
