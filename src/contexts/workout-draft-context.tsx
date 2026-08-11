import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

export type WorkoutExercise = {
  id: string;
  image: string | null;
  muscles: string;
  name: string;
  reps: number;
  rest: number;
  sets: number;
};

type WorkoutDraft = [
  WorkoutExercise[],
  Dispatch<SetStateAction<WorkoutExercise[]>>,
];

const WorkoutDraftContext = createContext<WorkoutDraft | null>(null);

export function WorkoutDraftProvider({ children }: React.PropsWithChildren) {
  const draft = useState<WorkoutExercise[]>([]);

  return (
    <WorkoutDraftContext.Provider value={draft}>
      {children}
    </WorkoutDraftContext.Provider>
  );
}

export function useWorkoutDraft() {
  const value = useContext(WorkoutDraftContext);
  if (!value)
    throw new Error("useWorkoutDraft must be used inside its provider");
  return value;
}
