import { differenceInCalendarDays, startOfDay, subDays } from "date-fns";

export type StreakSummary = {
  bestStreak: number;
  completedDays: Date[];
  currentStreak: number;
};

export function getStreakSummary(completedDates: Date[]): StreakSummary {
  const completedDaySet = new Set(
    completedDates.map((date) => startOfDay(date).getTime()),
  );
  const days = [...completedDaySet].sort((a, b) => a - b);

  if (days.length === 0) {
    return { bestStreak: 0, completedDays: [], currentStreak: 0 };
  }

  let cursor = startOfDay(new Date());
  if (!completedDaySet.has(cursor.getTime())) {
    cursor = subDays(cursor, 1);
  }

  let currentStreak = 0;
  while (completedDaySet.has(cursor.getTime())) {
    currentStreak++;
    cursor = subDays(cursor, 1);
  }

  let bestStreak = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of days) {
    run =
      prev !== null && differenceInCalendarDays(day, prev) === 1 ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    prev = day;
  }

  return {
    bestStreak,
    completedDays: days.map((day) => new Date(day)),
    currentStreak,
  };
}
