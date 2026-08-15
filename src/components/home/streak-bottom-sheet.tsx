import { Feather } from "@expo/vector-icons";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

const streakIcon = require("../../../assets/images/app-images/streak-icon.png");

type StreakBottomSheetProps = {
  bestStreak?: number;
  completedDays?: Date[];
  currentStreak?: number;
  onClose: () => void;
  visible: boolean;
};

export default function StreakBottomSheet({
  bestStreak = 0,
  completedDays = [],
  currentStreak = 0,
  onClose,
  visible,
}: StreakBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const today = startOfDay(new Date());
  const week = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });
  const dayLabel = currentStreak === 1 ? "day" : "days";
  const completedToday = completedDays.some((day) => isSameDay(day, today));

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityLabel="Close workout streak"
          accessibilityRole="button"
          className="absolute inset-0 bg-overlay/65"
          onPress={onClose}
        />

        <View
          accessibilityViewIsModal
          className="rounded-t-[34px] border-t border-border bg-card px-5 pt-14"
          style={{ paddingBottom: Math.max(insets.bottom, 20) + 12 }}
        >
          <View className="absolute -top-11 left-0 right-0 items-center">
            <View className="h-[88px] w-[88px] items-center justify-center rounded-full border-[5px] border-card bg-background shadow-lg shadow-primary/40">
              <Image
                accessibilityIgnoresInvertColors
                accessibilityLabel="Workout streak"
                className="h-12 w-12"
                resizeMode="contain"
                source={streakIcon}
              />
            </View>
          </View>

          <Text className="text-center font-inter-medium text-[14px] text-muted-foreground">
            Workout Streak
          </Text>
          <Text className="mt-1 text-center font-inter-bold text-[38px] tracking-[-1px] text-foreground">
            {currentStreak} {dayLabel}
          </Text>

          <View className="mt-7 flex-row gap-1.5">
            {week.map((day) => {
              const completed = completedDays.some((completedDay) =>
                isSameDay(completedDay, day),
              );
              const isToday = isSameDay(day, today);
              const isFuture = isAfter(day, today);

              return (
                <View
                  className={cn(
                    "h-[82px] flex-1 items-center justify-center rounded-2xl border bg-background",
                    isToday ? "border-primary" : "border-border",
                    isFuture && "opacity-40",
                  )}
                  key={day.toISOString()}
                >
                  <Text className="font-inter-semibold text-[10px] text-muted-foreground">
                    {format(day, "EE").toUpperCase()}
                  </Text>
                  {completed ? (
                    <View className="mt-2 h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Feather color="#FFFFFF" name="check" size={17} />
                    </View>
                  ) : (
                    <Text className="mt-2 font-inter-semibold text-[15px] text-foreground">
                      {format(day, "dd")}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <Text className="mt-7 text-center font-inter-semibold text-[15px] text-foreground">
            Best: {bestStreak} {bestStreak === 1 ? "day" : "days"}
          </Text>
          <Text className="mt-2 text-center font-inter text-[13px] leading-5 text-muted-foreground">
            {completedToday
              ? "Keep showing up. Your consistency is getting stronger."
              : currentStreak > 0
                ? "Complete a workout today to keep your streak going."
                : "Complete a workout today to start your streak."}
          </Text>

          <Button className="mt-7 h-16 rounded-full" onPress={onClose}>
            Okay
          </Button>
        </View>
      </View>
    </Modal>
  );
}
