"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn } from "@/shared/lib/utils";

export function MainButton({
  label,
  href,
  isLoading = false,
  icon,
}: {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <Button
      asChild
      size="lg"
      className={cn(
        "w-full bg-primary/70 flex gap-2 transition-opacity",
        isLoading && "pointer-events-none opacity-50",
      )}
    >
      <Link href={href} aria-disabled={isLoading} tabIndex={isLoading ? -1 : 0}>
        {isLoading && <Spinner className="w-4 h-4" />}
        {icon}
        <span className="text-foreground/80">{label}</span>
      </Link>
    </Button>
  );
}
