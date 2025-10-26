"use client";

import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card";

interface PageDescriptionProps {
  title: string;
  text?: string;
  highlight?: string;
  img?: string; // путь к картинке
}

export function PageDescription({ title, text, highlight, img }: PageDescriptionProps) {
  // Если картинки нет — рендерим обычный вариант
  if (!img) {
    return (
      <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg">
        <CardTitle className=" px-2 text-primary text-lg font-bold">{title}</CardTitle>
        <CardContent className="indent-6 space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
          {highlight && <span className="text-primary text-base font-bold">{highlight} </span>}
          {text && <span>{text}</span>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-0 gap-2 relative overflow-hidden border border-border shadow-lg">
      {/* Картинка с радиальным градиентом */}
      <div className="relative w-full h-40">
        <Image src={img} alt={title} fill className="object-cover" priority={true} />
        <div className="absolute inset-0 img-top-gradient"></div>
      </div>

      {/* Заголовок и хайлайт поверх картинки */}
      <div className="absolute top-4 left-4 z-10 text-primary">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        {highlight && <div className="text-base font-bold">{highlight}</div>}
      </div>

      {/* Текст под картинкой */}
      {text && (
        <CardContent className="indent-6 px-4 py-3 pt-1 text-sm leading-relaxed text-card-foreground text-justify">
          {text}
        </CardContent>
      )}
    </Card>
  );
}
