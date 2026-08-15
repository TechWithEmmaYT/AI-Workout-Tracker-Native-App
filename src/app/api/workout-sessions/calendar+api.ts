import { db, workoutSessions } from "@/db";
import { auth } from "@/lib/auth";
import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";

const MAX_RANGE_MS = 22 * 24 * 60 * 60 * 1000;

const rangeDateSchema = z
  .object({
    end: z.iso.datetime(),
    start: z.iso.datetime(),
  })
  .refine(({ end, start }) => new Date(start) < new Date(end), {
    error: "End date must be greater than the start date",
  })
  .refine(
    ({ end, start }) =>
      new Date(end).getTime() - new Date(start).getTime() <= MAX_RANGE_MS,
    {
      error: "Date range cannot be more than 22 days",
    },
  );

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
      startedAt: workoutSessions.startedAt,
    })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.userId, session.user.id),
        gte(workoutSessions.startedAt, start),
        lt(workoutSessions.startedAt, end),
      ),
    );

  const workoutDates = sessions.map(({ startedAt }) => startedAt.toISOString());

  return Response.json({
    workoutDates,
  });
}
