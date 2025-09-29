"use client";

import { useState } from "react";
import { X, Bell } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import Link from "next/link";

export function Notifications() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert className="px-2 w-full py-1 shine-effect relative flex items-start gap-2 bg-card border border-border shadow-md rounded-lg">
      <div className="flex-1 flex gap-3">
        <Bell className="h-5 w-5 text-primary shrink-0 " />
        <AlertTitle className="font-semibold">Новые миссии</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <Link
            href="#"
            className="text-primary hover:text-primar/80 font-medium underline underline-offset-2"
          >
            Проверь.
          </Link>
        </AlertDescription>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
