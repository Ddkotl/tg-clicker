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
    <Alert className="p-2 shine-effect relative flex items-start gap-2 bg-card border border-border shadow-md rounded-lg">
      {/* Иконка */}
      <Bell className="h-5 w-5 text-blue-500 shrink-0 mt-1" />

      {/* Текст */}
      <div className="flex-1 flex gap-3">
        <AlertTitle className="font-semibold">Новые миссии</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          <Link href="#" className="text-blue-500 hover:text-blue-400 font-medium underline underline-offset-2">
            Проверь.
          </Link>
        </AlertDescription>
      </div>

      {/* Кнопка закрытия */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
