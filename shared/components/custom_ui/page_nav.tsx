import { cn } from "@/shared/lib/utils";
import { MainButton } from "./main-button";

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
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
        <MainButton key={item.href} label={item.label} href={item.href} icon={item.icon} />
      ))}
    </div>
  );
}
