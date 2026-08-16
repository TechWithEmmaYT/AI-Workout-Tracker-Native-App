import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import Skeleton from "@/components/ui/skeleton";
import { useAppThemeColor } from "@/theme/app-theme";

type HomeStatsProps = {
  avgTimeSeconds?: number;
  isPending?: boolean;
  totalTimeSeconds?: number;
  workouts?: number;
};

const formatTotal = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatAvg = (seconds: number) => `${Math.round(seconds / 60)} min`;

export default function HomeStats({
  avgTimeSeconds = 0,
  isPending = false,
  totalTimeSeconds = 0,
  workouts = 0,
}: HomeStatsProps) {
  const primary = useAppThemeColor("primary");

  const stats = [
    { icon: "activity", label: "Workouts", value: String(workouts) },
    { icon: "clock", label: "Time", value: formatTotal(totalTimeSeconds) },
    {
      icon: "bar-chart-2",
      label: "Avg Time",
      value: formatAvg(avgTimeSeconds),
    },
  ] as const;

  return (
    <View className="mt-3 flex-row gap-2">
      {isPending
        ? stats.map((stat) => (
            <View
              className="min-h-[112px] flex-1 rounded-2xl border border-border bg-card px-3 py-4 shadow-xs"
              key={stat.label}
            >
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="mt-2 h-3 w-12 rounded-md" />
              <Skeleton className="mt-auto h-8 w-8 rounded-full" />
            </View>
          ))
        : stats.map((stat) => (
            <View
              className="min-h-[112px] flex-1 rounded-2xl border border-border bg-card px-3 py-4 shadow-xs"
              key={stat.label}
            >
              <Text
                adjustsFontSizeToFit
                className="font-inter-bold text-[19px] tracking-[-0.4px] text-foreground"
                numberOfLines={1}
              >
                {stat.value}
              </Text>
              <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
                {stat.label}
              </Text>
              <View className="mt-auto h-8 w-8 items-center justify-center rounded-full bg-accent dark:bg-accent/20">
                <Feather color={primary} name={stat.icon} size={16} />
              </View>
            </View>
          ))}
    </View>
  );
}
