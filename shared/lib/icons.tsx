import {
  GiDigDug,
  GiDodging,
  GiFire,
  GiFloatingCrystal,
  GiGhostAlly,
  GiHadesSymbol,
  GiHolyGrail,
  GiStonePile,
} from "react-icons/gi";
import { ReactNode } from "react";
import {
  ArrowRightCircle,
  Backpack,
  BellDot,
  Calendar,
  Clock,
  HeartPulse,
  Hourglass,
  PawPrint,
  Pickaxe,
  ScrollText,
  Swords,
  User,
  X,
} from "lucide-react";
import { MdOutlineTempleHindu } from "react-icons/md";
import { cn } from "@/shared/lib/utils";

type IconProps = {
  className?: string;
};

export const icons = {
  heart: ({ className }: IconProps): ReactNode => <HeartPulse className={cn("h-4 w-4 text-red-700", className)} />,
  user: ({ className }: IconProps): ReactNode => <User className={cn("h-4 w-4 text-primary", className)} />,
  backpack: ({ className }: IconProps): ReactNode => <Backpack className={cn("h-4 w-4 text-green-700", className)} />,
  clock: ({ className }: IconProps): ReactNode => <Clock className={cn("h-4 w-4 text-white/80", className)} />,
  qi_energy: ({ className }: IconProps): ReactNode => <GiFire className={cn("h-4 w-4 text-blue-400", className)} />,

  exp: ({ className }: IconProps): ReactNode => <GiDodging className={cn("h-4 w-4 text-green-400", className)} />,

  stone: ({ className }: IconProps): ReactNode => <GiStonePile className={cn("h-4 w-4 text-yellow-400", className)} />,

  crystal: ({ className }: IconProps): ReactNode => (
    <GiFloatingCrystal className={cn("h-4 w-4 text-purple-400", className)} />
  ),

  notification: ({ className }: IconProps): ReactNode => <BellDot className={cn("h-5 w-5 text-primary", className)} />,

  fact: ({ className }: IconProps): ReactNode => <ScrollText className={cn("h-5 w-5 text-white/80", className)} />,

  temple: ({ className }: IconProps): ReactNode => (
    <MdOutlineTempleHindu className={cn("h-5 w-5 text-white/80", className)} />
  ),

  citadel: ({ className }: IconProps): ReactNode => (
    <GiHadesSymbol className={cn("h-5 w-5 text-white/80", className)} />
  ),

  fight: ({ className }: IconProps): ReactNode => <Swords className={cn("h-5 w-5 text-white/80", className)} />,

  pet: ({ className }: IconProps): ReactNode => <PawPrint className={cn("h-5 w-5 text-white/80", className)} />,

  trophy: ({ className }: IconProps): ReactNode => <GiHolyGrail className={cn("h-8 w-8 text-white/80", className)} />,

  dig: ({ className }: IconProps): ReactNode => <GiDigDug className={cn("h-5 w-5 text-white/80", className)} />,

  meditation: ({ className }: IconProps): ReactNode => <Hourglass className={cn("h-5 w-5 text-white/80", className)} />,
  spirit_path: ({ className }: IconProps): ReactNode => (
    <GiGhostAlly className={cn("h-5 w-5 text-white/80", className)} />
  ),
  mine: ({ className }: IconProps): ReactNode => <Pickaxe className={cn("h-5 w-5 text-primary", className)} />,
  calendar: ({ className }: IconProps): ReactNode => (
    <Calendar className={cn("h-3.5 w-3.5 text-primary/60", className)} />
  ),
  arrow_right: ({ className }: IconProps): ReactNode => (
    <ArrowRightCircle className={cn("h-5 w-5 text-primary", className)} />
  ),
  close: ({ className }: IconProps): ReactNode => <X className={cn("h-5 w-5 text-primary", className)} />,
};
