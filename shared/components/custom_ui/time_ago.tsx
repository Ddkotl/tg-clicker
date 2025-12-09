"use client";

import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";

export const TimeAgo = ({ date, className }: { date: number; className?: string }) => {
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!currentTime) {
    return <span>Загрузка...</span>; // Показываем текст, пока не загрузилось текущее время
  }
  const timeDiff = currentTime - date;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    // Если прошло более 24 часов, показываем дату в формате день/месяц/год
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1; // Месяцы начинаются с 0
    const year = new Date(date).getFullYear();
    return (
      <span className={cn(className, "text-sm")}>{`${day < 10 ? `0${day}` : day}/${
        month < 10 ? `0${month}` : month
      }/${year}`}</span>
    );
  }

  if (hours >= 1) {
    // Если прошло меньше 24 часов, показываем количество часов назад
    if (hours >= 2 && hours <= 4) {
      return <span>{`${hours} часа назад`}</span>;
    }
    if (hours >= 22 && hours <= 24) {
      return <span>{`${hours} часа назад`}</span>;
    }
    return <span>{`${hours} час${hours > 1 ? "ов" : ""} назад`}</span>;
  }

  if (minutes >= 1) {
    // Если прошло меньше часа, показываем количество минут назад
    if (minutes === 1) {
      return <span>{`${minutes} минуту назад`}</span>;
    }
    if (minutes >= 2 && minutes <= 4) {
      return <span>{`${minutes} минуты назад`}</span>;
    }
    if (minutes === 21 || minutes === 31 || minutes === 41 || minutes === 51) {
      return <span>{`${minutes} минуту назад`}</span>;
    }

    return <span>{`${minutes} минут назад`}</span>;
  }

  return <span>Только что</span>;
};
