import { cn } from "@/shared/lib/utils";
import { MainButton } from "./main-button";
import { Soon } from "./Soon";

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  soon?: string;
};

export function PageNav({
  nav_items,
  className = "flex flex-col gap-2",
}: {
  nav_items: NavItem[];
  className?: string;
}) {
  return (
    <div className={cn("transition-opacity  duration-200", className)}>
      {nav_items.map((item) => (
        <div key={item.href} className="relative">
          <MainButton label={item.label} href={item.href} icon={item.icon} />
          {item.soon && <Soon soon={item.soon} />}
        </div>
      ))}
    </div>
  );
}
