import LoadingModal from "@/components/loading-modal";
import Button from "@/components/ui/button";
import EmtyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import {
  createWorkoutSessionMutationFn,
  getWorkoutQueryFn,
  SaveSessionSet,
  WorkoutDetail,
  WorkoutExercise,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const formatTime = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);

type Timer = ReturnType<typeof useWorkoutTimer>;

const ActiveSessionPage = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [completed, setCompleted] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const timer = useWorkoutTimer();

  const valuesRef = useRef<Record<string, { reps?: string; weight?: string }>>(
    {},
  );
  const allowLeave = useRef(false);

  const {
    data: workout,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["workouts", id],
    queryFn: () => getWorkoutQueryFn(id),
    enabled: Boolean(id),
  });

  const totalSets = (workout?.exercises ?? []).reduce(
    (sum, exercise) => sum + (exercise.sets ?? 0),
    0,
  );

  const saveSession = useCallback(async () => {
    if (!workout) return false;
    setIsSaving(true);
    try {
      const sets: SaveSessionSet[] = [];
      workout.exercises.forEach((exercise) => {
        for (let set = 1; set <= (exercise.sets ?? 0); set++) {
          const key = `${exercise.id}-${set}`;
          if (!completed.includes(key)) continue;

          const values = valuesRef.current[key];
          const weight = Number(values.weight);
          sets.push({
            exerciseId: exercise.id,
            setNumber: set,
            reps: parseInt(values?.reps ?? "", 10) || exercise.reps || 0,
            weight: weight > 0 ? weight : undefined,
          });
        }
      });
      await createWorkoutSessionMutationFn({
        workoutId: workout.id,
        startedAt: new Date(timer.startedAt).toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: Math.round(timer.elapsed),
        sets,
      });

      await Promise.all(
        ["history", "home-stats", "workout-calendar", "streak"].map(
          (queryKey) => queryClient.invalidateQueries({ queryKey: [queryKey] }),
        ),
      );
      return true;
    } catch {
      Alert.alert("Could not save", "Check your connection");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [completed, queryClient, timer, workout]);

  const saveSessionRef = useRef(saveSession);

  useEffect(() => {
    saveSessionRef.current = saveSession;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (allowLeave.current) return;
      event.preventDefault();

      const wasPaused = timer.isPaused;
      timer.pause();

      const resumeTimer = () => {
        if (!wasPaused) timer.resume();
      };

      const leave = () => {
        allowLeave.current = true;
        navigation.dispatch(event.data.action);
      };

      if (completed.length === 0) {
        Alert.alert("Leave workout?", "Your progress will not be saved", [
          { text: "Cancel", style: "cancel", onPress: resumeTimer },
          { text: "Leave", style: "destructive", onPress: leave },
        ]);
        return;
      }

      Alert.alert(
        "Save progress?",
        `You completed ${completed.length} of ${totalSets} sets`,
        [
          { text: "Cancel", style: "cancel", onPress: resumeTimer },
          { text: "Discard", style: "destructive", onPress: leave },
          {
            text: "Save & Leave",
            onPress: async () => {
              if (await saveSessionRef.current()) leave();
            },
          },
        ],
      );
    });

    return unsubscribe;
  }, [completed, navigation, totalSets]);

  const finishWorkout = () => {
    const wasPaused = timer.isPaused;
    timer.pause();

    Alert.alert(
      "Finish Workout?",
      `${completed.length} of ${totalSets} sets completed`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            if (!wasPaused) timer.resume();
          },
        },
        {
          text: "Finish",
          onPress: async () => {
            if (!(await saveSession())) return;
            allowLeave.current = true;
            router.replace("/history");
          },
        },
      ],
    );
  };

  const recordValue = (
    key: string,
    field: "reps" | "weight",
    value: string,
  ) => {
    valuesRef.current[key] = {
      ...valuesRef.current[key],
      [field]: value,
    };
  };

  const toggleSet = (exercise: WorkoutExercise, set: number) => {
    const key = `${exercise.id}-${set}`;
    const isDone = completed.includes(key);
    setCompleted((prev) =>
      isDone ? prev.filter((item) => item !== key) : [...prev, key],
    );
    if (!isDone) timer.startRest(exercise.rest ?? 0);
  };

  if (isPending) return <ActiveSkeleton />;

  if (isError || !workout) {
    return (
      <EmtyState message="Could not load this workout" onRetry={refetch} />
    );
  }
  return (
    <SafeAreaScreen>
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerClassName="flex-grow"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ActiveSession
          completed={completed}
          timer={timer}
          workout={workout}
          recordValue={recordValue}
          toggleSet={toggleSet}
          onFinish={finishWorkout}
          onLeave={router.back}
        />
        <LoadingModal message="Saving workout..." visible={isSaving} />
        <KeyboardToolbar />
      </KeyboardAwareScrollView>
    </SafeAreaScreen>
  );
};

type ActiveSessionProps = {
  completed: string[];
  onFinish: () => void;
  onLeave: () => void;
  recordValue: (key: string, field: "reps" | "weight", value: string) => void;
  timer: Timer;
  toggleSet: (exercise: WorkoutExercise, set: number) => void;
  workout: WorkoutDetail;
};

function ActiveSession({
  completed,
  onFinish,
  onLeave,
  recordValue,
  timer,
  toggleSet,
  workout,
}: ActiveSessionProps) {
  const insets = useSafeAreaInsets();

  const muted = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const [expanded, setExpanded] = useState(workout.exercises[0]?.name ?? "");

  const completedExercises = workout.exercises.filter((exercise) =>
    Array.from({ length: exercise.sets ?? 0 }, (_, index) => index + 1).every(
      (set) => completed.includes(`${exercise.id}-${set}`),
    ),
  ).length;

  return (
    <>
      <View className="flex-grow px-5 pb-32">
        <View className="flex-row items-start justify-between pt-4">
          <View>
            <Text className="font-inter-bold text-[24px] text-foreground">
              {workout.name}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              {completedExercises}/{workout.exercises.length} exercises
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onLeave}>
            <Text className="font-inter-semibold text-[13px] text-primary">
              Leave
            </Text>
          </Pressable>
        </View>

        <View className="my-7 flex-row items-center justify-between">
          <View>
            <Text className="font-inter-bold text-[38px] tracking-[-1px] text-foreground">
              {formatTime(timer.elapsed)}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              Elapsed Time
            </Text>
          </View>
          <Pressable
            accessibilityLabel={
              timer.isPaused ? "Resume workout" : "Pause workout"
            }
            className="h-16 w-16 items-center justify-center rounded-full bg-primary"
            onPress={timer.togglePause}
          >
            <Feather
              color="white"
              name={timer.isPaused ? "play" : "pause"}
              size={26}
            />
          </Pressable>
        </View>

        <View className="gap-3">
          {workout.exercises.map((exercise) => {
            const isExpanded = expanded === exercise.name;
            return (
              <View
                className="overflow-hidden rounded-xl border border-border bg-card"
                key={exercise.id}
              >
                <Pressable
                  className="flex-row items-center px-4 py-4"
                  onPress={() => setExpanded(isExpanded ? "" : exercise.name)}
                >
                  <View className="flex-1">
                    <Text className="font-inter-bold text-[14px] text-foreground">
                      {exercise.name}
                    </Text>
                    <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                      {exercise.sets} sets • {exercise.reps} reps •{" "}
                      {exercise.rest}s rest
                    </Text>
                  </View>
                  <Feather
                    color={muted}
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                  />
                </Pressable>

                {isExpanded && (
                  <View className="border-t border-border">
                    <View className="h-10 flex-row items-center px-4">
                      {[
                        ["SET", "w-12"],
                        ["WEIGHT", "flex-1"],
                        ["REPS", "flex-1"],
                        ["STATUS", "w-14"],
                      ].map(([label, width]) => (
                        <Text
                          className={`${width} text-center font-inter-semibold text-[10px] text-muted-foreground`}
                          key={label}
                        >
                          {label}
                        </Text>
                      ))}
                    </View>

                    {Array.from(
                      { length: exercise.sets ?? 0 },
                      (_, index) => index + 1,
                    ).map((set) => {
                      const key = `${exercise.id}-${set}`;
                      const isDone = completed.includes(key);
                      return (
                        <View
                          className={cn(
                            "h-14 flex-row items-center border-t border-border px-4",
                            isDone && "bg-accent",
                          )}
                          key={key}
                        >
                          <Text className="w-12 text-center font-inter-semibold text-[13px] text-foreground">
                            {set}
                          </Text>
                          <TextInput
                            className="mx-1 h-10 flex-1 rounded-lg bg-muted 
                text-center font-inter text-[13px] text-foreground"
                            keyboardType="decimal-pad"
                            onChangeText={(value) =>
                              recordValue(key, "weight", value)
                            }
                            placeholder={
                              exercise.targetWeight
                                ? String(exercise.targetWeight)
                                : "kg"
                            }
                            placeholderTextColor={muted}
                            selectionColor={primary}
                          />
                          <TextInput
                            className="mx-1 h-10 flex-1 rounded-lg bg-muted 
                text-center font-inter text-[13px] text-foreground"
                            defaultValue={String(exercise.reps)}
                            keyboardType="number-pad"
                            onChangeText={(value) =>
                              recordValue(key, "reps", value)
                            }
                            placeholderTextColor={muted}
                            selectionColor={primary}
                          />
                          <Pressable
                            accessibilityLabel={`Complete set ${set}`}
                            className="w-14 items-center"
                            onPress={() => toggleSet(exercise, set)}
                          >
                            <Feather
                              color={isDone ? primary : muted}
                              name={isDone ? "check-circle" : "circle"}
                              size={22}
                            />
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Button className="mt-5" onPress={onFinish} size="sm">
          Finish Workout
        </Button>
      </View>
      {timer.rest > 0 && (
        <View
          className="absolute right-5 h-28 w-28 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-950 p-3 shadow-lg"
          style={{ bottom: insets.bottom + 10 }}
        >
          <Text className="font-inter text-[10px] text-white">Rest Timer</Text>
          <Text className="mt-1 font-inter-bold text-[20px] text-blue-400">
            {Math.floor(timer.rest / 60)}:
            {String(Math.floor(timer.rest % 60)).padStart(2, "0")}
          </Text>
          <Pressable onPress={timer.skipRest}>
            <Text className="mt-1 font-inter-semibold text-[10px] text-blue-400">
              Skip
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

function ActiveSkeleton() {
  return (
    <SafeAreaScreen edges={["top", "bottom"]}>
      <View className="flex-1 px-5 pt-4">
        <Skeleton className="h-8 w-2/3 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-24 rounded-md" />
        <Skeleton className="mt-7 h-12 w-44 rounded-lg" />
        <View className="mt-8 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="h-16 w-full rounded-xl" key={index} />
          ))}
        </View>
      </View>
    </SafeAreaScreen>
  );
}

export default ActiveSessionPage;
