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

export async function createWorkoutMutationFn(data: CreateWorkoutInput) {
  const response = await fetch(`${API_URL}/api/workouts`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      Cookie: authClient.getCookies(),
    },
  });

  if (!response.ok) throw new Error("Could not create workout");
}
