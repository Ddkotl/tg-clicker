"use client";

import React from "react";

interface CountdownTimerProps {
  /** Конечное время в миллисекундах (Date.now() + ...) */
  endTime: number;
  /** Текст перед таймером, например "Осталось:" */
  label?: string;
  /** Вызывается, когда таймер дойдет до нуля */
  onComplete?: () => void;
}

export function CountdownTimer({ endTime, label, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(() => endTime - Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(endTime - Date.now(), 0);
      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    return `${minutes}:${pad(seconds)}`;
  };

  return (
    <span className="text-sm font-medium text-foreground/80  flex items-center gap-1">
      {label && <span>{label}</span>}
      {formatTime(timeLeft)}
    </span>
  );
}
