"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface PageDescriptionProps {
  title: string;
  text?: string;
  highlight?: string;
}

export function PageDescription({ title, text, highlight }: PageDescriptionProps) {
  return (
    <Card className="px-1 py-4 gap-2 bg-card border border-border shadow-lg ">
      <CardHeader className="px-2">
        <CardTitle className="text-primary text-lg font-bold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 px-2 text-sm leading-relaxed text-card-foreground text-justify">
        {highlight && <span className="text-primary text-base font-bold">{highlight} </span>}
        {text && <span>{text}</span>}
      </CardContent>
    </Card>
  );
}
