import Button from "@/components/ui/button";
import EmtyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { getWorkoutQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mutedForeground = useAppThemeColor("mutedForeground");
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

  const exercises = workout?.exercises ?? [];
  const totalSets = exercises.reduce(
    (sum, exercise) => sum + (exercise.sets ?? 0),
    0,
  );

  const stats = [
    { icon: "list", label: `${exercises.length} Exercises` },
    { icon: "layers", label: `${totalSets} Sets` },
  ] as const;

  if (isPending) return <WorkoutDetailSkeleton />;

  return (
    <SafeAreaScreen edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-80 bg-muted">
          {workout?.image ? (
            <>
              <Image
                className="h-full w-full"
                resizeMode="cover"
                source={{ uri: workout.image }}
              />
              <View className="absolute inset-0 bg-black/20" />
            </>
          ) : (
            <View className="h-full items-center justify-center bg-muted">
              <Feather color={mutedForeground} name="image" size={40} />
            </View>
          )}
        </View>

        <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
          <View className="h-14 flex-row items-center justify-between px-4">
            <Pressable
              className="h-11 w-11 items-center justify-center rounded-full bg-black/40 active:opacity-70"
              onPress={router.back}
            >
              <Feather color="white" name="arrow-left" size={23} />
            </Pressable>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-black/40">
              <Feather color="white" name="more-horizontal" size={23} />
            </View>
          </View>
        </SafeAreaView>

        {isError ? (
          <EmtyState message="Could not load this workout" onRetry={refetch} />
        ) : (
          <View className="px-5">
            <Text className="mt-4 font-inter-bold text-[24px] text-foreground">
              {workout?.name}
            </Text>
            {Boolean(workout?.muscles) && (
              <Text className="mt-1 font-inter capitalize text-[13px] text-muted-foreground">
                {workout?.muscles}
              </Text>
            )}

            <View className="mt-4 flex-row gap-5">
              {stats.map((stat) => (
                <View
                  className="flex-row items-center gap-1.5"
                  key={stat.label}
                >
                  <Feather color={mutedForeground} name={stat.icon} size={14} />
                  <Text className="font-inter text-[12px] text-muted-foreground">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              className="mt-5"
              leftIcon={<Feather color="white" name="play" size={17} />}
              onPress={() =>
                router.push({
                  pathname: "/workout/[id]/active",
                  params: { id },
                })
              }
            >
              Start Workout
            </Button>

            <View>
              <Text className="mb-3 mt-6 font-inter-bold text-[16px] text-foreground">
                Exercises
              </Text>
              {exercises.length === 0 ? (
                <EmtyState
                  icon="activity"
                  message="No exercises in this workout"
                />
              ) : (
                <View className="overflow-hidden rounded-xl border border-border bg-card">
                  {exercises.map((exercise, index) => (
                    <View
                      className="h-16 flex-row items-center border-b border-border px-4 last:border-b-0"
                      key={`${exercise.name}-${index}`}
                    >
                      <View className="h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Text className="font-inter-semibold text-[12px] text-muted-foreground">
                          {index + 1}
                        </Text>
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="font-inter-semibold text-[13px] text-foreground">
                          {exercise.name}
                        </Text>
                        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                          {exercise.sets} sets • {exercise.reps} reps •{" "}
                          {exercise.rest}s rest
                        </Text>
                      </View>
                      <Feather color={mutedForeground} name="menu" size={17} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaScreen>
  );
};

function WorkoutDetailSkeleton() {
  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="never"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      <View className="h-64">
        <Skeleton className="h-full w-full rounded-none" />
        <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
          <View className="h-14 flex-row items-center justify-between px-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="h-11 w-11 rounded-full" />
          </View>
        </SafeAreaView>
      </View>

      <View className="px-5">
        <Skeleton className="mt-4 h-8 w-2/3 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
        <View className="mt-4 flex-row gap-5">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </View>
        <Skeleton className="mt-5 h-14 rounded-xl" />
      </View>
    </ScrollView>
  );
}

export default Index;
