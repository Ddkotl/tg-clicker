import { Droplet } from "lucide-react";
import { ReactNode } from "react";

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const icons = {
  qi_energy: ({ size = 20, color = "blue", className = "" }: IconProps): ReactNode => (
    <Droplet size={size} color={color} className={className} />
  ),
  exp: ({ size = 20, color = "green", className = "" }: IconProps): ReactNode => (
    <svg viewBox="0 0 24 24" fill={color} width={size} height={size} className={className}>
      <polygon points="12,2 15,8 21,12 15,16 12,22 9,16 3,12 9,8" />
    </svg>
  ),
};
