import { db, workoutSessions } from "@/db";
import { auth } from "@/lib/auth";
import { differenceInCalendarDays } from "date-fns";
import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";

// const MAX_DAY_RANGE_MS = 26 * 60 * 60 * 1000;

const rangeDateSchema = z
  .object({
    end: z.iso.datetime(),
    start: z.iso.datetime(),
  })
  .refine(({ end, start }) => new Date(start) < new Date(end), {
    error: "End date must be greater than the start date",
  })
  .refine(
    ({ end, start }) => {
      // Safely checks calendar days
      return differenceInCalendarDays(new Date(end), new Date(start)) <= 1;
    },
    {
      message: "Date range is too long",
    },
  );
// .refine(
//   ({ end, start }) =>
//     new Date(end).getTime() - new Date(start).getTime() <= MAX_DAY_RANGE_MS,
//   {
//     error: "Date range is too long",
//   },
// );

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);

  const range = rangeDateSchema.safeParse({
    end: url.searchParams.get("end"),
    start: url.searchParams.get("start"),
  });

  if (!range.success)
    return Response.json({ message: "Invalid date range" }, { status: 400 });

  const start = new Date(range.data.start);
  const end = new Date(range.data.end);

  const sessions = await db
    .select({
      durationSeconds: workoutSessions.durationSeconds,
    })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.userId, session.user.id),
        gte(workoutSessions.startedAt, start),
        lt(workoutSessions.startedAt, end),
      ),
    );

  const workouts = sessions.length;

  const totalTimeSeconds = sessions.reduce(
    (sum, { durationSeconds }) => sum + durationSeconds,
    0,
  );

  const avgTimeSeconds = workouts ? Math.round(totalTimeSeconds / workouts) : 0;

  return Response.json({
    avgTimeSeconds,
    totalTimeSeconds,
    workouts,
  });
}
