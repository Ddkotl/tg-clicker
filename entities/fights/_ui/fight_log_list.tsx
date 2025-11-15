// components/FightLogList.tsx

import { FightLog } from "../_domain/types";

type Props = {
  log: FightLog;
};

export const FightLogList = ({ log }: Props) => {
  return (
    <div className="max-h-64 overflow-y-auto border p-2 rounded">
      {log.map((step, idx) => (
        <p key={idx} className="text-sm">
          [{new Date(step.timestamp).toLocaleTimeString()}] {step.text}
        </p>
      ))}
    </div>
  );
};
