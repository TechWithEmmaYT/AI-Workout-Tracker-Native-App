import {
    EXERCISE_DATA_URL,
    EXERCISE_IMAGE_URL,
    EXERCISE_NAMES,
    type SourceExercise,
} from "./exercises";

const selectedNames = new Set<string>(EXERCISE_NAMES);

async function seed() {
  process.loadEnvFile();

  const { db } = await import("../index");
  const { exercises } = await import("../schema");
  const response = await fetch(EXERCISE_DATA_URL);
  if (!response.ok) throw new Error("Could not download exercise data");

  const source = ((await response.json()) as SourceExercise[]).filter(
    ({ name }) => selectedNames.has(name),
  );

  if (source.length !== 20)
    throw new Error(`Found ${source.length}/20 exercises`);

  const values = source.map((exercise) => ({
    slug: exercise.id.replaceAll("_", "-").toLowerCase(),
    name: exercise.name,
    userId: "RVnXsgnpQVYR2bEGoBJ2wGx7RwqPPPjC",
    image: exercise.images[0]
      ? `${EXERCISE_IMAGE_URL}/${exercise.images[0]}`
      : null,
    muscles: exercise.primaryMuscles.join(" • "),
    description: `${exercise.name} is a ${exercise.level} ${exercise.category} exercise targeting ${exercise.primaryMuscles.join(", ")}.`,
    equipment: exercise.equipment,
    difficulty: exercise.level,
    forceType: exercise.force,
    mechanics: exercise.mechanic,
    category: exercise.category,
  }));

  await db.insert(exercises).values(values).onConflictDoNothing();
  console.log("Exercise seed complete");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
