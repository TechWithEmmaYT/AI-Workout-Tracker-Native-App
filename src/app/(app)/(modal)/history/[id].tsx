import Button from "@/components/ui/button";
import EmtyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { getHistoryDetailQueryFn } from "@/lib/api";
import { formatDuration, formatSessionDate } from "@/lib/format";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const SingleHistory = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const mutedForeground = useAppThemeColor("mutedForeground");

  const { data, isError, isPending, refetch } = useQuery({
    queryKey: ["history", id],
    queryFn: () => getHistoryDetailQueryFn(id),
    enabled: Boolean(id),
  });

  if (isPending) return <HistoryDetailSkeleton />;

  if (!Error || !data) {
    return (
      <EmtyState
        message="Could not load this history session"
        onRetry={refetch}
      />
    );
  }
  return (
    <SafeAreaScreen>
      <ScrollView contentContainerClassName="px-5 pb-8">
        <View className="h-14 flex-row items-center justify-between">
          <Pressable
            className="h-11 w-11  -ml-3  items-center justify-center"
            onPress={router.back}
          >
            <Feather color={mutedForeground} name="arrow-left" size={23} />
          </Pressable>
          <Feather color={mutedForeground} name="more-horizontal" size={23} />
        </View>

        <Text className="font-inter-bold text-[24px] text-foreground">
          {data.workoutName}
        </Text>
        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
          {formatSessionDate(data.completedAt)}
        </Text>

        <View className="my-5 flex-row gap-2">
          <StatCard
            label="Duration"
            value={formatDuration(data.durationSeconds)}
          />
          <StatCard label="Sets" value={String(data.setCount)} />
          <StatCard
            label="Volume"
            value={
              data.volume !== null ? `${data.volume.toLocaleString()} kg` : "-"
            }
          />
        </View>

        <View>
          <Text className="mb-3 font-inter-bold text-base text-foreground">
            Exercises
          </Text>
          <View className="overflow-hidden rounded-xl border border-border bg-card">
            {data.exercises.map((exercise) => (
              <View
                key={exercise.id}
                className="min-h-20 flex-row items-center border-b border-border px-3 py-2 last:border-b-0"
              >
                {exercise.image ? (
                  <Image
                    className="h-11 w-12 rounded-lg bg-muted"
                    resizeMode="cover"
                    source={{ uri: exercise.image }}
                  />
                ) : (
                  <View className="h-11 w-12 items-center justify-center rounded-lg bg-muted">
                    <Feather color={mutedForeground} name="image" size={16} />
                  </View>
                )}

                <View className="ml-3 flex-1">
                  <Text className="font-inter-semibold text-[13px] text-foreground">
                    {exercise.name}
                  </Text>

                  <View className="mt-1 flex-row flex-wrap gap-1">
                    {exercise.sets.map((set, i) => (
                      <View
                        key={i}
                        className="rounded-md bg-muted px-1.5 py-0.5"
                      >
                        <Text className="font-inter text-[10px] text-muted-foreground">
                          {(set.weight || 0) ?? "—"}kg × {set.reps}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button
            className="mt-6"
            leftIcon={<Feather color="white" name="repeat" size={17} />}
            onPress={() =>
              router.push({
                pathname: "/workout/[id]/active",
                params: { id: data.workoutId },
              })
            }
            size="sm"
          >
            Repeat Workout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center rounded-xl border border-border bg-card px-2 py-4">
      <Text className="font-inter text-[11px] text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-2 font-inter-bold text-[14px] text-foreground">
        {value}
      </Text>
    </View>
  );
}
function HistoryDetailSkeleton() {
  return (
    <SafeAreaScreen edges={["top"]}>
      <View className="flex-1 px-5 pt-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="mt-5 h-7 w-2/3 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-32 rounded-md" />
        <View className="mt-5 flex-row gap-2">
          <Skeleton className="h-20 flex-1 rounded-xl" />
          <Skeleton className="h-20 flex-1 rounded-xl" />
          <Skeleton className="h-20 flex-1 rounded-xl" />
        </View>
        <Skeleton className="mt-6 h-5 w-24 rounded-md" />
        <View className="mt-3 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-20 w-full rounded-xl" key={index} />
          ))}
        </View>
      </View>
    </SafeAreaScreen>
  );
}

export default SingleHistory;
