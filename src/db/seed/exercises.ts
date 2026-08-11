export const EXERCISE_DATA_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

export const EXERCISE_IMAGE_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

export const EXERCISE_NAMES = [
  "Barbell Bench Press - Medium Grip",
  "Barbell Squat",
  "Barbell Deadlift",
  "Romanian Deadlift",
  "Pullups",
  "Wide-Grip Lat Pulldown",
  "Seated Cable Rows",
  "Standing Military Press",
  "Side Lateral Raise",
  "Barbell Curl",
  "Hammer Curls",
  "Triceps Pushdown",
  "Pushups",
  "Leg Press",
  "Leg Extensions",
  "Lying Leg Curls",
  "Standing Calf Raises",
  "Plank",
  "Crunches",
  "Dumbbell Lunges",
] as const;

export type SourceExercise = {
  category: string;
  equipment: string | null;
  force: string | null;
  id: string;
  images: string[];
  level: string;
  mechanic: string | null;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
};
