import { addDays, startOfDay } from "date-fns";
import { API_URL, authClient } from "./auth-client";

export type WorkoutListItem = {
  exerciseCount: number;
  id: string;
  image: string | null;
  muscles: string;
  name: string;
  totalSets: number;
};

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

export type WorkoutExercise = {
  id: string;
  image: string | null;
  muscles: string;
  name: string;
  targetWeight?: number | null;
  reps?: number;
  rest?: number;
  sets?: number;
};

export type WorkoutDetail = {
  description: string | null;
  exercises: WorkoutExercise[];
  id: string;
  image: string | null;
  muscles: string;
  name: string;
};

export type SaveSessionSet = {
  exerciseId: string;
  reps: number;
  setNumber: number;
  weight?: number;
};

export type SaveSessionInput = {
  completedAt: string;
  durationSeconds: number;
  sets: SaveSessionSet[];
  startedAt: string;
  workoutId: string;
};

export type HistorySessionItem = {
  id: string;
  workoutId: string;
  workoutName: string;
  image: string | null;
  completedAt: string;
  durationSeconds: number;
  exerciseCount: number;
  setCount: number;
};

export type HistorySet = {
  reps: number;
  weight: number | null;
};

export type HistoryExercise = {
  id: string;
  name: string;
  image: string | null;
  sets: HistorySet[];
};

export type HistoryDetail = {
  id: string;
  image: string | null;
  workoutId: string;
  workoutName: string;
  completedAt: string;
  durationSeconds: number;
  exercises: HistoryExercise[];
  setCount: number;
  volume: number | null;
};

export type HomeStats = {
  avgTimeSeconds: number;
  totalTimeSeconds: number;
  workouts: number;
};

export type WorkoutCalendarDates = {
  workoutDates: string[];
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

export async function getWorkoutsQueryFn(limit?: number) {
  const { data, error } = await authClient.$fetch<WorkoutListItem[]>(
    `${API_URL}/api/workouts${limit ? `?limit=${limit}` : ""}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not create workout");

  return data;
}

export async function getWorkoutQueryFn(id: string) {
  const { data, error } = await authClient.$fetch<WorkoutDetail>(
    `${API_URL}/api/workouts/${id}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not create workout");

  return data;
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

export async function createWorkoutSessionMutationFn(data: SaveSessionInput) {
  const { data: result, error } = await authClient.$fetch(
    `${API_URL}/api/workout-sessions`,
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

export async function getHistoryQueryFn(limit?: number) {
  const query = limit === undefined ? "" : `?limit=${limit}`;
  const { data, error } = await authClient.$fetch<HistorySessionItem[]>(
    `${API_URL}/api/workout-sessions${query}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not create workout");

  return data;
}

export async function getHistoryDetailQueryFn(id: string) {
  const { data, error } = await authClient.$fetch<HistoryDetail>(
    `${API_URL}/api/workout-sessions/${id}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not create workout");

  return data;
}

export async function getHomeStatsQueryFn(date: Date) {
  const start = startOfDay(date);
  const end = addDays(start, 1); // beginning of the following day
  const query = new URLSearchParams({
    end: end.toISOString(),
    start: start.toISOString(),
  });

  const { data, error } = await authClient.$fetch<HomeStats>(
    `${API_URL}/api/home-stats?${query}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not load home stats");

  return data;
}

export async function getWorkoutCalendarDatesQueryFn(start: Date, end: Date) {
  const query = new URLSearchParams({
    end: end.toISOString(),
    start: start.toISOString(),
  });

  const { data, error } = await authClient.$fetch<WorkoutCalendarDates>(
    `${API_URL}/api/workout-sessions/calendar?${query}`,
    {
      method: "GET",
    },
  );
  if (error) throw new Error("Could not load workout dates");

  return data;
}
