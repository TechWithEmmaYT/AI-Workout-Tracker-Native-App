import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import { getHistoryQueryFn } from "@/lib/api";
import { formatDuration, formatSessionDate } from "@/lib/format";
import { useAppThemeColor } from "@/theme/app-theme";
import HomeSectionHeader from "./home-section-header";

export default function RecentWorkout() {
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const { data, isPending } = useQuery({
    queryKey: ["history", 1],
    queryFn: () => getHistoryQueryFn(1),
  });
  const recent = data?.[0];

  return (
    <View className="mt-5">
      <HomeSectionHeader
        onViewAll={() => router.push("/history")}
        title="Recent Workout"
      />

      {isPending ? (
        <Skeleton className="min-h-[88px] w-full rounded-xl" />
      ) : !recent ? (
        <EmptyState icon="clock" message="No recent workouts yet." />
      ) : (
        <Pressable
          className="min-h-[88px] flex-row items-center rounded-xl border border-border bg-card p-3 active:opacity-85"
          onPress={() =>
            router.push({
              pathname: "/(app)/(modal)/history/[id]",
              params: { id: recent.id },
            })
          }
        >
          {recent.image ? (
            <Image
              className="h-16 w-20 rounded-lg bg-muted"
              resizeMode="cover"
              source={{ uri: recent.image }}
            />
          ) : (
            <View className="h-16 w-20 items-center justify-center rounded-lg bg-muted">
              <Feather color={muted} name="image" size={20} />
            </View>
          )}
          <View className="ml-3 flex-1">
            <Text className="font-inter-semibold text-[14px] text-foreground">
              {recent.workoutName}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              {formatSessionDate(recent.completedAt)}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              {recent.exerciseCount} Exercises • {recent.setCount} Sets •{" "}
              {formatDuration(recent.durationSeconds)}
            </Text>
          </View>
          <Feather color={muted} name="chevron-right" size={22} />
        </Pressable>
      )}
    </View>
  );
}
