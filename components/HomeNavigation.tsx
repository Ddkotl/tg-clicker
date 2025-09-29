"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavMenu() {
  const menuItems = [
    { label: "📜 Хроники", href: "/facts" },
    { label: "⚔️ Схватка", href: "/battle" },
    { label: "🏰 Штаб", href: "/hq" },
    { label: "🌆 Город", href: "/city" },
    { label: "🕵️ Тайный агент", href: "/agent" },
    { label: "🏆 Рейтинг", href: "/ranking" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button asChild className="w-full" size="lg">
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}
