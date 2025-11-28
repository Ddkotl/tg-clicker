export function getPastedIntervals({
  now_ms,
  last_action_ms,
  interval_ms,
}: {
  now_ms: number;
  last_action_ms: number;
  interval_ms: number;
}) {
  let past_intervals;
  let new_last_action_date;
  const diff_time = now_ms - last_action_ms;
  if (diff_time < interval_ms) {
    past_intervals = 0;
    new_last_action_date = last_action_ms;
  } else {
    past_intervals = Math.floor(diff_time / interval_ms);
    new_last_action_date = last_action_ms + past_intervals * interval_ms;
  }
  return {
    past_intervals: past_intervals,
    new_last_action_date: new Date(new_last_action_date),
  };
}
