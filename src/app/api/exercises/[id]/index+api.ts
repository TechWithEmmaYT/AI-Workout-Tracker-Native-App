import { db, exercises } from "@/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

export async function GET(request: Request, { id }: Record<string, string>) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  if (!idSchema.safeParse(id).success)
    return Response.json({ message: "Exercise not found" }, { status: 404 });

  const [exercise] = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, id))
    .limit(1);

  if (!exercise) {
    return Response.json(
      {
        message: "Exercise not found",
      },
      { status: 404 },
    );
  }

  return Response.json(exercise);
}
