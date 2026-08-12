import { db, exercises } from "@/db";
import { auth } from "@/lib/auth";
import { asc, ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const search = new URL(request.url).searchParams.get("search");

  const data = await db
    .select({
      id: exercises.id,
      name: exercises.name,
      image: exercises.image,
      muscles: exercises.muscles,
    })
    .from(exercises)
    .where(
      search
        ? or(
            ilike(exercises.name, `%${search}%`),
            ilike(exercises.muscles, `%${search}%`),
          )
        : undefined,
    )
    .orderBy(asc(exercises.name));

  return Response.json(data);
}
