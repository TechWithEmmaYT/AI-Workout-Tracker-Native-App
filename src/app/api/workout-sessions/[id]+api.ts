import {
    db,
    exercises as exerciseTable,
    workouts,
    workoutSessions,
    workoutSessionSets,
} from "@/db";
import { auth } from "@/lib/auth";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

export async function GET(request: Request, { id }: Record<string, string>) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const result = idSchema.safeParse(id);
  if (!result.success) {
    return Response.json(
      { message: "Invalid session id", error: result.error },
      { status: 400 },
    );
  }

  const [sessionRows, completedSetRows] = await db.batch([
    db
      .select({
        id: workoutSessions.id,
        workoutId: workoutSessions.workoutId,
        completedAt: workoutSessions.completedAt,
        durationSeconds: workoutSessions.durationSeconds,
        workoutName: workouts.name,
        image: workouts.image,
      })
      .from(workoutSessions)
      .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId))
      .where(
        and(
          eq(workoutSessions.id, id),
          eq(workoutSessions.userId, session.user.id),
        ),
      )
      .limit(1),

    db
      .select({
        exerciseId: exerciseTable.id,
        exerciseName: exerciseTable.name,
        exerciseImage: exerciseTable.image,
        setNumber: workoutSessionSets.setNumber,
        reps: workoutSessionSets.reps,
        weight: workoutSessionSets.weight,
      })
      .from(workoutSessionSets)
      .innerJoin(
        exerciseTable,
        eq(exerciseTable.id, workoutSessionSets.exerciseId),
      )
      .where(eq(workoutSessionSets.sessionId, id))
      .orderBy(
        asc(workoutSessionSets.exerciseId),
        asc(workoutSessionSets.setNumber),
      ),
  ]);

  const sessionRow = sessionRows[0];

  if (!sessionRow) {
    return Response.json({ message: "Session not found" }, { status: 404 });
  }

  const exercisesById = new Map<
    string,
    {
      id: string;
      name: string;
      image: string | null;
      sets: {
        reps: number;
        weight: number | null;
      }[];
    }
  >();

  let volume: number | null = null;

  for (const completedSet of completedSetRows) {
    const existingExercise = exercisesById.get(completedSet.exerciseId);

    if (existingExercise) {
      existingExercise.sets.push({
        reps: completedSet.reps,
        weight: completedSet.weight,
      });
    } else {
      exercisesById.set(completedSet.exerciseId, {
        id: completedSet.exerciseId,
        name: completedSet.exerciseName,
        image: completedSet.exerciseImage,
        sets: [
          {
            reps: completedSet.reps,
            weight: completedSet.weight,
          },
        ],
      });
    }

    if (completedSet.weight !== null) {
      volume = (volume ?? 0) + completedSet.weight * completedSet.reps;
    }
  }

  return Response.json({
    ...sessionRow,
    exercises: [...exercisesById.values()],
    setCount: completedSetRows.length,
    volume: volume !== null ? Math.round(volume) : null,
  });
}
