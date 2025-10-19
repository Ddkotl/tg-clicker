"use client";

import { ArrowRightCircle, ClockArrowDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import Link from "next/link";

interface ProcessAlertProps {
  endTime: number;
  href: string;
  description: string;
  label: string;
}

export function ProcessAlert({ endTime, description, label, href }: ProcessAlertProps) {
  return (
    <Alert className="px-2 w-full justify-between py-1 animate-pulse relative flex items-center gap-2 bg-card border border-border shadow-md rounded-lg">
      <div className="flex-1 flex gap-3">
        <ClockArrowDown className="h-5 w-5 text-primary shrink-0" />
        <AlertTitle className="font-semibold">{`${description}: `}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <div className="text-primary hover:text-primary/80 font-medium underline underline-offset-2">
            <CountdownTimer endTime={endTime} label={label} />
          </div>
        </AlertDescription>
      </div>
      <Link href={href} className="text-primary hover:text-primary/80 font-medium underline underline-offset-2">
        <ArrowRightCircle />
      </Link>
    </Alert>
  );
}
