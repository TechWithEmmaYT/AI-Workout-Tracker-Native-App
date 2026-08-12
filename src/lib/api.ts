import { API_URL, authClient } from "./auth-client";

export type CreateWorkoutInput = {
  name: string;
  description?: string;
  image?: string;
  exercises: {
    id: string;
    reps?: number;
    rest?: number;
    sets?: number;
  }[];
};

export type ExerciseItem = {
  category: string;
  description: string;
  difficulty: string;
  equipment: string | null;
  forceType: string | null;
  id: string;
  image: string | null;
  mechanics: string | null;
  muscles: string;
  name: string;
};

export async function createWorkoutMutationFn(data: CreateWorkoutInput) {
  // const response = await fetch(`${API_URL}/api/workouts`, {
  //   method: "POST",
  //   body: JSON.stringify(data),
  //   credentials: "omit",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Cookie: authClient.getCookies(),
  //   },
  // });

  // if (!response.ok) throw new Error("Could not create workout");
  const { data: result, error } = await authClient.$fetch(
    `${API_URL}/api/workouts`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (error) throw new Error("Could not create workout");

  return result;
}

export async function getExercisesQueryFn(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const { data, error } = await authClient.$fetch<ExerciseItem[]>(
    `${API_URL}/api/exercises${query}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not create workout");

  return data;
}

export async function getExerciseQueryFn(id: string) {
  const { data, error } = await authClient.$fetch<ExerciseItem>(
    `${API_URL}/api/exercises/${id}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not create workout");

  return data;
}

export async function getExerciseInstructionsQueryFn(id: string) {
  const { data, error } = await authClient.$fetch<{
    instructions: string[];
  }>(`${API_URL}/api/exercises/${id}/instructions`, {
    method: "GET",
  });
  if (error) throw new Error("Could not create workout");

  return data;
}
