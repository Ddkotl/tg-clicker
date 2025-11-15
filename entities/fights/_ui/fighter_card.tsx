// components/FighterCard.tsx

import { FighterSnapshot } from "../_domain/types";

type Props = {
  fighter: FighterSnapshot;
  title?: string;
};

export const FighterCard = ({ fighter, title }: Props) => {
  return (
    <div className="border p-4 rounded-lg shadow-md w-full max-w-sm">
      {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
      <p>Name: {fighter.name}</p>
      <p>Power: {fighter.power}</p>
      <p>Protection: {fighter.protection}</p>
      <p>Speed: {fighter.speed}</p>
      <p>Skill: {fighter.skill}</p>
      <p>
        HP: {fighter.currentHp} / {fighter.maxHp}
      </p>
    </div>
  );
};
