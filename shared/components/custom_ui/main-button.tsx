"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export function MainButton({
  item,
  isLoading,
}: {
  item: {
    label: string;
    href: string;
  };
  isLoading?: boolean;
}) {
  return (
    <>
      {isLoading ? (
        <Button
          disabled
          key={item.href}
          className="w-full bg-primary/40 shine"
          size="lg"
        />
      ) : (
        <Link key={item.href} href={item.href}>
          <Button asChild className="w-full bg-primary/80" size="lg">
            <span>{item.label}</span>
          </Button>
        </Link>
      )}
    </>
  );
}
