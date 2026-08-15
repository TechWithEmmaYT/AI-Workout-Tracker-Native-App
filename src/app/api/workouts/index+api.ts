import { db, exercises, workoutExercises, workouts } from "@/db";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/imagekit";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

const workoutSchema = z.object({
  name: z.string().trim().min(1).max(80),
  image: z.string().min(100).max(12_000_000).nullable().optional(),
  description: z.string().trim().max(500).optional(),
  exercises: z
    .array(
      z.object({
        id: z.uuid(),
        reps: z.number().int().min(1).max(100),
        rest: z.number().int().min(0).max(600),
        sets: z.number().int().min(1).max(20),
        targetWeight: z.number().min(0).optional(),
      }),
    )
    .min(1)
    .max(10),
});

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const limitVal = new URL(request.url).searchParams.get("limit");

  const limit = limitVal
    ? z.coerce.number().int().min(1).max(20).safeParse(limitVal)
    : null;

  if (limit && !limit.success) {
    return Response.json(
      {
        message: "Invalid limit",
      },
      { status: 400 },
    );
  }

  const query = db
    .select({
      exerciseCount: count(workoutExercises.id),
      id: workouts.id,
      name: workouts.name,
      image: workouts.image,
      muscles: sql<string>`coalesce(string_agg(distinct ${exercises.muscles}, ' • '), '')`,
      totalSets: sql<number>`coalesce(sum(${workoutExercises.sets}), 0)::int`,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(
      and(eq(workouts.userId, session.user.id), eq(workouts.isTemplate, false)),
    )
    .groupBy(workouts.id)
    .orderBy(desc(workouts.createdAt));

  const data = limit?.success ? await query.limit(limit.data) : await query;

  return Response.json(data);
}
export async function POST(request: Request) {
  const body = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const result = workoutSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { message: "Invalid data", error: result.error },
      { status: 400 },
    );
  }
  const { description, exercises, image, name } = result.data;

  const hasDuplicateExercise =
    new Set(exercises.map(({ id }) => id)).size !== exercises.length;
  if (hasDuplicateExercise) {
    return Response.json({ message: "Duplicate Exercise" }, { status: 400 });
  }

  //Image Upload
  const imageUrl = image
    ? await uploadImage(image, `workout-${session.user.id}-${Date.now()}.jpg`)
    : null;

  const workoutId = crypto.randomUUID();
  const [created] = await db.batch([
    db
      .insert(workouts)
      .values({
        id: workoutId,
        userId: session.user.id,
        name,
        description: description || null,
        image: imageUrl,
      })
      .returning(),
    db.insert(workoutExercises).values(
      exercises.map((exercise, position) => ({
        exerciseId: exercise.id,
        position,
        reps: exercise.reps,
        restSeconds: exercise.rest,
        sets: exercise.sets,
        targetWeight: exercise.targetWeight,
        workoutId,
      })),
    ),
  ]);

  return Response.json(created[0], { status: 201 });
}
