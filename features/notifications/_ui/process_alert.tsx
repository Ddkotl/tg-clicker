"use client";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { CountdownTimer } from "@/shared/components/custom_ui/timer";
import Link from "next/link";
import { icons } from "@/shared/lib/icons";

interface ProcessAlertProps {
  icon?: React.ReactNode;
  endTime: number;
  href: string;
  description: string;
  label: string;
  endTimeAction?: () => void;
}
export function ProcessAlert({ icon, endTime, description, label, href, endTimeAction }: ProcessAlertProps) {
  return (
    <Alert className="px-2 w-full justify-between py-1 relative flex items-center gap-2 bg-card border border-border shadow-md rounded-lg">
      <div className="flex-1 flex gap-3">
        {icon}
        <AlertTitle className="font-semibold">{`${description}: `}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <div className="text-primary hover:text-primary/80 font-medium underline underline-offset-2">
            <CountdownTimer endTime={endTime} label={label} onComplete={endTimeAction} />
          </div>
        </AlertDescription>
      </div>
      <Link href={href} className="text-primary hover:text-primary/80 font-medium underline underline-offset-2">
        {icons.arrow_right({})}
      </Link>
    </Alert>
  );
}
