import {
    db,
    exercises as exerciseTable,
    workoutExercises,
    workouts,
} from "@/db";
import { auth } from "@/lib/auth";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

export async function GET(request: Request, { id }: Record<string, string>) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!idSchema.safeParse(id).success) {
    return Response.json({ message: "WorkoutId not valid" }, { status: 400 });
  }

  const [workoutRows, exerciseRows] = await db.batch([
    db
      .select({
        id: workouts.id,
        name: workouts.name,
        image: workouts.image,
        description: workouts.description,
      })
      .from(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.userId, session.user.id))),

    db
      .select({
        id: exerciseTable.id,
        image: exerciseTable.image,
        muscles: exerciseTable.muscles,
        name: exerciseTable.name,
        position: workoutExercises.position,
        reps: workoutExercises.reps,
        rest: workoutExercises.restSeconds,
        sets: workoutExercises.sets,
        targetWeight: workoutExercises.targetWeight,
      })
      .from(workoutExercises)
      .innerJoin(
        exerciseTable,
        eq(exerciseTable.id, workoutExercises.exerciseId),
      )
      .where(eq(workoutExercises.workoutId, id))
      .orderBy(asc(workoutExercises.position)),
  ]);

  const workout = workoutRows[0];
  if (!workout)
    return Response.json({ message: "Workout not found" }, { status: 404 });

  const muscles = [...new Set(exerciseRows.map(({ muscles }) => muscles))].join(
    " • ",
  );

  return Response.json({
    ...workout,
    exercises: exerciseRows,
    muscles,
  });
}
