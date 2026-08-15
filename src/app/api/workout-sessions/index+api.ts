import {
  db,
  workoutExercises,
  workouts,
  workoutSessions,
  workoutSessionSets,
} from "@/db";
import { auth } from "@/lib/auth";
import { and, count, countDistinct, desc, eq } from "drizzle-orm";
import { z } from "zod";

const setSchema = z.object({
  exerciseId: z.uuid(),
  setNumber: z.number().int().min(1).max(20),
  reps: z.number().int().min(0).max(500),
  weight: z.number().min(0).max(1000).optional(),
});

const sessionSchema = z.object({
  workoutId: z.uuid(),
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
  durationSeconds: z.number().int().min(0),
  sets: z.array(setSchema).max(100),
});

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const value = new URL(request.url).searchParams.get("limit");
  const limit = value
    ? z.coerce.number().int().min(1).max(20).safeParse(value)
    : null;

  if (limit && !limit.success)
    return Response.json({ message: "Invalid limit" }, { status: 400 });

  const query = db
    .select({
      id: workoutSessions.id,
      workoutId: workoutSessions.workoutId,
      completedAt: workoutSessions.completedAt,
      durationSeconds: workoutSessions.durationSeconds,
      exerciseCount: countDistinct(workoutSessionSets.exerciseId),
      setCount: count(workoutSessionSets.id),
      workoutName: workouts.name,
      image: workouts.image,
    })
    .from(workoutSessions)
    .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId))
    .leftJoin(
      workoutSessionSets,
      eq(workoutSessionSets.sessionId, workoutSessions.id),
    )
    .where(eq(workoutSessions.userId, session.user.id))
    .groupBy(workoutSessions.id, workouts.id)
    .orderBy(desc(workoutSessions.completedAt));

  const rows = limit?.success ? await query.limit(limit.data) : await query;

  return Response.json(rows);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = sessionSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { message: "Invalid paylaod", error: result.error },
      { status: 400 },
    );
  }

  const { completedAt, durationSeconds, sets, startedAt, workoutId } =
    result.data;

  const [workoutRows, exerciseIdRows] = await db.batch([
    db
      .select({ id: workouts.id })
      .from(workouts)
      .where(
        and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)),
      )
      .limit(1),
    db
      .select({ exerciseId: workoutExercises.exerciseId })
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId)),
  ]);

  if (workoutRows.length === 0)
    return Response.json({ message: "Workout not found" }, { status: 404 });

  const exerciseIds = new Set(
    exerciseIdRows.map(({ exerciseId }) => exerciseId),
  );

  const validSets = sets.filter(({ exerciseId }) =>
    exerciseIds.has(exerciseId),
  );

  const sessionId = crypto.randomUUID();
  await db.batch([
    db.insert(workoutSessions).values({
      id: sessionId,
      userId: session.user.id,
      workoutId,
      startedAt: new Date(startedAt),
      completedAt: new Date(completedAt),
      durationSeconds,
    }),

    db.insert(workoutSessionSets).values(
      validSets.map((set) => ({
        sessionId,
        exerciseId: set.exerciseId,
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight ?? null,
      })),
    ),
  ]);

  return Response.json(
    {
      message: "Workout session created",
      id: sessionId,
    },
    { status: 201 },
  );
}
