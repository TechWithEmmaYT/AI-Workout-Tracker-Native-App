import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import EmptyState from "@/components/ui/empty-state";
import Skeleton from "@/components/ui/skeleton";
import { getWorkoutsQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";
import { cssInterop } from "nativewind";
import HomeSectionHeader from "./home-section-header";

cssInterop(LinearGradient, {
  className: "style",
});

export default function MyWorkouts() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const muted = useAppThemeColor("mutedForeground");
  const openWorkouts = () => router.push("/workouts");
  const createWorkout = () => router.push("/workout/create");

  const {
    data: workouts = [],
    isError,
    isPending,
  } = useQuery({
    queryFn: () => getWorkoutsQueryFn(4),
    queryKey: ["workouts", { limit: 4 }],
  });

  return (
    <View className="mt-5">
      <HomeSectionHeader title="My Workouts" onViewAll={openWorkouts} />

      {isPending ? (
        <View className="flex-row gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              className="h-44 rounded-xl shadow-xs"
              key={index}
              style={{ width: Math.max(128, (width - 56) / 3) }}
            />
          ))}
        </View>
      ) : workouts.length === 0 ? (
        <EmptyState
          icon={isError ? "wifi-off" : "activity"}
          message={
            isError
              ? "Could not load workouts."
              : "Tap + to create your first workout."
          }
        />
      ) : (
        <ScrollView
          className="-mx-5"
          contentContainerClassName="gap-2 px-5 py-1"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {workouts.map((workout) => (
            <Pressable
              className="rounded-2xl shadow-xs"
              key={workout.id}
              onPress={() =>
                router.push({
                  pathname: "/workout/[id]",
                  params: { id: workout.id },
                })
              }
              style={{ width: Math.max(128, (width - 56) / 3) }}
            >
              <View className="min-h-[112px] overflow-hidden rounded-2xl border border-border bg-card">
                {workout.image ? (
                  <Image
                    className="h-24 w-full bg-muted"
                    source={{ uri: workout.image }}
                  />
                ) : (
                  <View className="h-24 items-center justify-center bg-muted">
                    <Feather color={muted} name="image" size={22} />
                  </View>
                )}
                <View className="px-3 pb-3 pt-2.5">
                  <Text className="font-inter-semibold line-clamp-1 truncate text-[14px] text-foreground">
                    {workout.name}
                  </Text>
                  <Text
                    className="mt-1 font-inter capitalize text-[12px] text-muted-foreground"
                    numberOfLines={1}
                  >
                    {workout.muscles}
                  </Text>
                  <View className="mt-2 flex-row justify-between">
                    <View className="flex-row items-center gap-1">
                      <FontAwesome6 color={muted} name="dumbbell" size={11} />
                      <Text className="font-inter text-[11px] text-muted-foreground">
                        {workout.exerciseCount} exe
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Feather color={muted} name="layers" size={12} />
                      <Text className="font-inter text-[11px] text-muted-foreground">
                        {workout.totalSets} sets
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View className="mt-3 rounded-2xl shadow-xs">
        <Pressable
          className="overflow-hidden rounded-2xl active:opacity-90"
          onPress={createWorkout}
        >
          <LinearGradient
            className="flex-row items-center p-5"
            colors={["#0EA5E9", "#2563EB", "#1D4ED8"]}
            end={{ x: 1, y: 0.3 }}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
          >
            <View className="flex-1">
              <Text className="font-inter-bold text-[22px] text-primary-foreground">
                Create your own
              </Text>
              <Text className="mt-1 font-inter text-[12px] text-primary-foreground/80">
                Pick exercises, sets and reps
              </Text>
              <View className="mt-4 self-start rounded-full bg-white px-5 py-2">
                <Text className="font-inter-semibold text-[12px] text-primary">
                  Create
                </Text>
              </View>
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Feather color="white" name="edit-3" size={29} />
            </View>
          </LinearGradient>
        </Pressable>
      </View>

      {/* <Pressable
        className="mt-3 flex-row items-center overflow-hidden rounded-2xl p-5 active:opacity-90"
        onPress={createWorkout}
        style={{
          experimental_backgroundImage:
            "linear-gradient(110deg, #0EA5E9 0%, #2563EB 55%, #1D4ED8 100%)",
        }}
      >
        <View className="flex-1">
          <Text className="font-inter-bold text-[22px] text-primary-foreground">
            Create your own
          </Text>
          <Text className="mt-1 font-inter text-[12px] text-primary-foreground/80">
            Pick exercises, sets and reps
          </Text>
          <View className="mt-4 self-start rounded-full bg-white px-5 py-2">
            <Text className="font-inter-semibold text-[12px] text-primary">
              Create
            </Text>
          </View>
        </View>
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
          <Feather color="white" name="edit-3" size={29} />
        </View>
      </Pressable> */}
    </View>
  );
}
