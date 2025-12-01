export function IsCooldown({ last_action_time, cooldown_time }: { last_action_time: number; cooldown_time: number }) {
  const now = new Date().getTime();

  const diff = now - last_action_time;
  return diff < cooldown_time;
}
