import { GiFire } from "react-icons/gi";
import { ReactNode } from "react";
import { MdOutlineTempleHindu } from "react-icons/md";
import { GiHadesSymbol } from "react-icons/gi";
import { GiBloodySword } from "react-icons/gi";
import { GiHolyGrail } from "react-icons/gi";
import { GiStonePile } from "react-icons/gi";
import { GiDigDug } from "react-icons/gi";
import { GiDodging } from "react-icons/gi";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const icons = {
  qi_energy: ({ size = 20, color = "blue", className = "" }: IconProps): ReactNode => (
    <GiFire size={size} color={color} className={className} />
  ),
  exp: ({ size = 20, color = "green", className = "" }: IconProps): ReactNode => (
    <GiDodging size={size} color={color} className={className} />
  ),
  stone: ({ size = 20, color = "yellow", className = "" }: IconProps): ReactNode => (
    <GiStonePile size={size} color={color} className={className} />
  ),
  crystal: ({ size = 20, color = "purple", className = "" }: IconProps): ReactNode => (
    <GiFloatingCrystal size={size} color={color} className={className} />
  ),
  notification: ({ size = 20, color = "primary", className = "" }: IconProps): ReactNode => (
    <BellDot /> size={size} color={color} className={className} />
  ),
  fact: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <ScrollText size={size} color={color} className={className} />
  ),
  temple: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <MdOutlineTempleHindu size={size} color={color} className={className} />
  ),
  citadel: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <GiHadesSymbol size={size} color={color} className={className} />
  ),
  fight: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <GiBloodySword size={size} color={color} className={className} />
  ),
  pet: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <PawPrint size={size} color={color} className={className} />
  ),
  trophy: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <GiHolyGrail  size={size} color={color} className={className} />
  ),
  dig: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <GiDigDug size={size} color={color} className={className} />
  ),
  meditation: ({ size = 20, color = "white", className = "" }: IconProps): ReactNode => (
    <Hourglass size={size} color={color} className={className} />
  ),
};
