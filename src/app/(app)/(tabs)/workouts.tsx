import EmtyState from "@/components/ui/empty-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { getWorkoutsQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Workouts = () => {
  const router = useRouter();
  const mutedForeground = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const [query, setQuery] = useState("");

  const {
    data: workouts = [],
    isError,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryFn: () => getWorkoutsQueryFn(),
    queryKey: ["workouts"],
  });

  return (
    <SafeAreaScreen>
      <FlatList
        data={workouts}
        contentContainerClassName="px-5 pb-24"
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isPending ? (
            <View className="gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-24 rounded-xl" key={index} />
              ))}
            </View>
          ) : isError ? (
            <EmtyState message="Could not load workouts" onRetry={refetch} />
          ) : (
            <EmtyState icon="activity" message="No workouts found" />
          )
        }
        ListHeaderComponent={
          <View className="pb-5 pt-3">
            <Text
              className="font-inter-bold text-[24px]  text-foreground
             tracking-[-0.5px]
            "
            >
              My Workouts
            </Text>
            <View className="mt-5 h-12 flex-row items-center rounded-xl border border-input-border bg-muted px-4">
              <Feather color={mutedForeground} name="search" size={19} />
              <TextInput
                accessibilityLabel="Search workouts"
                className="ml-3 flex-1 font-inter text-[13px] text-foreground "
                onChangeText={setQuery}
                placeholder="Search workouts..."
                placeholderTextColor={mutedForeground}
                returnKeyType="search"
                selectionColor={primary}
                value={query}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center rounded-xl border border-border bg-card p-3 active:bg-muted"
            onPress={() =>
              router.push({
                pathname: "/workout/[id]",
                params: { id: item.id },
              })
            }
          >
            {item.image ? (
              <Image
                className="h-[72px] w-[82px] rounded-lg bg-muted"
                resizeMode="cover"
                source={{ uri: item.image }}
              />
            ) : (
              <View className="h-[72px] w-[82px] items-center justify-center rounded-lg bg-muted">
                <Feather color={mutedForeground} name="image" size={22} />
              </View>
            )}

            <View className="ml-3 flex-1">
              <Text
                className="font-inter-semibold text-[15px] text-foreground"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                className="mt-1 font-inter capitalize text-[11.5px] text-muted-foreground"
                numberOfLines={1}
              >
                {item.muscles}
              </Text>
              <Text
                className="mt-2 font-inter text-[11.5px] text-muted-foreground"
                numberOfLines={1}
              >
                {item.exerciseCount} exercises • {item.totalSets} sets
              </Text>
            </View>
            <Feather color={mutedForeground} name="chevron-right" size={20} />
          </TouchableOpacity>
        )}

        refreshControl={
          <RefreshControl
            tintColor={primary}
            colors={[primary]}
            refreshing={isRefetching}
            onRefresh={() => refetch}
          />
        }

        showsVerticalScrollIndicator={false}
      />
    </SafeAreaScreen>
  );
};

export default Workouts;
