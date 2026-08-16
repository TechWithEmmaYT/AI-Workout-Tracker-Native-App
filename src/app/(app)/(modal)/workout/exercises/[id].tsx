import AiCoachModal from "@/components/exercise/ai-coach-modal";
import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { getExerciseQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const exerciseParamsSchema = z.object({ id: z.string().min(1) });

const SingleExercise = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const foreground = useAppThemeColor("foreground");
  const primary = useAppThemeColor("primary");

  const result = exerciseParamsSchema.safeParse({
    id: Array.isArray(params.id) ? params.id[0] : params.id,
  });
  const id = result.success ? result.data.id : "";

  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const {
    data: exercise,
    isError,
    isPending,
  } = useQuery({
    enabled: Boolean(id),
    queryFn: () => getExerciseQueryFn(id),
    queryKey: ["exercise", id],
  });

  if (!id || isError) {
    return (
      <SafeAreaScreen className="px-5" edges={["top", "bottom"]}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center"
          onPress={() => router.back()}
        >
          <Feather color={foreground} name="arrow-left" size={23} />
        </Pressable>
        <View className="flex-1 items-center justify-center pb-16">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Feather color={foreground} name="alert-circle" size={28} />
          </View>
          <Text className="mt-5 font-inter-bold text-[20px] text-foreground">
            Exercise not found
          </Text>
          <Text className="mt-2 text-center font-inter text-[13px] text-muted-foreground">
            This exercise may no longer be available.
          </Text>
          <Button className="mt-6" onPress={() => router.back()} size="sm">
            Back to Exercises
          </Button>
        </View>
      </SafeAreaScreen>
    );
  }

  if (isPending || !exercise) {
    return <ExerciseDetailSkeleton onBack={router.back} />;
  }

  return (
    <SafeAreaScreen edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-80 bg-muted">
          {exercise.image ? (
            <Image
              accessibilityLabel={`${exercise.name} demonstration`}
              className="h-full w-full"
              resizeMode="cover"
              source={{ uri: exercise.image }}
            />
          ) : (
            <View className="h-full items-center justify-center">
              <Feather color={foreground} name="image" size={36} />
            </View>
          )}
          <View className="absolute inset-0 bg-black/20" />

          <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
            <View className="h-14 flex-row items-center justify-between px-4">
              <Pressable
                accessibilityLabel="Go back"
                className="h-10 w-10 items-center justify-center rounded-full bg-black/40 active:opacity-70"
                onPress={() => router.back()}
              >
                <Feather color="white" name="arrow-left" size={22} />
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/40 active:opacity-70">
                <Feather color="white" name="bookmark" size={22} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-5">
          <Text className="mt-5 font-inter-bold text-[24px] tracking-[-0.5px] text-foreground">
            {exercise.name}
          </Text>
          <Text className="mt-1 font-inter-medium capitalize text-[13px] text-primary">
            {exercise.muscles}
          </Text>
          <View className="mt-6">
            <Text className="font-inter-bold text-[17px] text-foreground">
              Description
            </Text>
            <Text className="font-inter leading-6 text-sm text-muted-foreground">
              {exercise.description}
            </Text>
          </View>

          <Pressable
            className="mt-5 min-h-14 flex-row items-center rounded-xl border
        border-primary bg-accent px-4 active:opacity-80 dark:bg-accent/20"
            onPress={() => setIsCoachOpen(true)}
          >
            <Feather color={primary} name="message-circle" size={21} />
            <Text className="ml-3 flex-1 font-inter-semibold text-[14px] text-primary">
              Ask AI Coach
            </Text>
            <Feather color={primary} name="chevron-right" size={21} />
          </Pressable>

          <View className="mt-6 overflow-hidden rounded-2xl bg-card border-border px-4">
            <ExerciseInfoRow
              icon="tool"
              label="Equipment"
              value={exercise.equipment}
            />
            <ExerciseInfoRow
              icon="bar-chart-2"
              label="Difficulty"
              value={exercise.difficulty}
            />
            <ExerciseInfoRow
              icon="target"
              label="Force Type"
              value={exercise.forceType}
            />
            <ExerciseInfoRow
              icon="activity"
              label="Mechanics"
              value={exercise.mechanics}
            />
          </View>
        </View>
      </ScrollView>

      <AiCoachModal
        exercise={exercise}
        visible={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />
    </SafeAreaScreen>
  );
};

function ExerciseInfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string | null;
}) {
  const primary = useAppThemeColor("primary");
  return (
    <View className="min-h-[68px] flex-row items-center border-b border-border py-3 last:border-b-0">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent dark:bg-accent/20">
        <Feather color={primary} name={icon} size={19} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-inter capitalize text-[11.5px] text-muted-foreground">
          {label}
        </Text>
        <Text className="mt-1 font-inter-semibold capitalize text-[13px] text-foreground">
          {value ?? "Not specified"}
        </Text>
      </View>
    </View>
  );
}

function ExerciseDetailSkeleton({ onBack }: { onBack: () => void }) {
  const foreground = useAppThemeColor("foreground");

  return (
    <SafeAreaScreen edges={["bottom"]}>
      <View className="h-80">
        <Skeleton className="absolute inset-0 rounded-none" />
        <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
          <View className="h-14 px-4">
            <Pressable
              accessibilityLabel="Go back"
              className="h-10 w-10 items-center justify-center rounded-full bg-card"
              onPress={onBack}
            >
              <Feather color={foreground} name="arrow-left" size={22} />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
      <View className="gap-3 px-5 pt-5">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-2/6" />
        <Skeleton className="h-4 w-1/3" />
      </View>
    </SafeAreaScreen>
  );
}

export default SingleExercise;
