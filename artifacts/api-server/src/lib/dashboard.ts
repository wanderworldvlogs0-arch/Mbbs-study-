export const DAILY_GOAL_TARGETS = {
  chapters: 3,
  mcqs: 20,
  videos: 2,
} as const;

/** Returns today's date as YYYY-MM-DD (UTC). A per-user timezone would be a
 * nice follow-up, but the mockup didn't specify one, so this keeps it simple. */
export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** The last 7 calendar days (UTC) as YYYY-MM-DD strings, oldest first, ending today. */
export function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

/** First day of the current calendar month (UTC) as YYYY-MM-DD. */
export function monthStartDateString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}
