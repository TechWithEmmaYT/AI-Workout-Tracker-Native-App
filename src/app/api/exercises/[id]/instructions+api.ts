import { db, exercises } from "@/db";
import { auth } from "@/lib/auth";
import { generateText, Output } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

const idSchema = z.uuid();

const instructionsOutputSchema = z.object({
  instructions: z
    .array(z.string())
    .min(1)
    .describe(
      "Step-by-step instructions on how to perform the exercise safely and with proper form",
    ),
});

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

  try {
    const { output } = await generateText({
      model: "google/gemini-2.5-flash",
      output: Output.object({
        schema: instructionsOutputSchema,
      }),
      system:
        "You are an expert AI fitness coach. Generate 4 to 5 concise, actionable step-by-step instructions for performing the given exercise with proper form.",
      prompt: `Exercise: ${exercise.name}\nCategory: ${exercise.category}\nTarget Muscles: ${exercise.muscles}\nDescription: ${exercise.description}`,
    });

    if (output?.instructions && output.instructions.length > 0) {
      return Response.json({
        instructions: output.instructions,
      });
    }
  } catch (error) {
    console.log("AI generation failed", error);
  }

  return Response.json({
    instructions: [],
  });
}
