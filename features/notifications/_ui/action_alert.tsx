"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { usePathname } from "next/navigation";

interface ActionAlert {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionText: string;
  href: string;
  onClose?: () => void;
  className?: string;
}

export function ActionAlert({ icon, title, description, actionText, href, onClose, className = "" }: ActionAlert) {
  const pathname = usePathname();
  const [closedManually, setClosedManually] = useState(false);

  const visible = !closedManually && pathname !== href;

  const handleClose = () => {
    setClosedManually(true);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <Alert
      className={`px-2 w-full justify-between py-1 relative flex items-center gap-2 bg-card border border-border shadow-md rounded-lg ${className}`}
    >
      <div className="flex-1 flex gap-3 items-start">
        <div className="shrink-0">{icon}</div>
        <div className="flex gap-2">
          <AlertTitle className="font-semibold text-foreground">{title}</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {description}{" "}
            <Link
              href={href}
              onClick={handleClose}
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
            >
              {actionText}
            </Link>
          </AlertDescription>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={handleClose}
      >
        <X className="h-6 w-6" />
      </Button>
    </Alert>
  );
}
