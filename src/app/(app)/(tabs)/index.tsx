import { useQuery } from "@tanstack/react-query";
import { addWeeks, startOfDay, startOfWeek, subWeeks } from "date-fns";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import HomeStats from "@/components/home/home-stats";
import MyWorkouts from "@/components/home/my-workouts";
import RecentWorkout from "@/components/home/recent-workout";
import WorkoutTemplates from "@/components/home/workout-templates";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import WeekCalendar from "@/components/week-calendar";
import { getHomeStatsQueryFn, getWorkoutCalendarDatesQueryFn } from "@/lib/api";

const logo = require("../../../../assets/images/app-images/logo.png");
const streakIcon = require("../../../../assets/images/app-images/streak-icon.png");

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));

  const currentWeekStart = startOfWeek(new Date());
  const calendarStart = subWeeks(currentWeekStart, 2);
  const calendarEnd = addWeeks(currentWeekStart, 1);

  const { data: stats, isPending } = useQuery({
    queryKey: ["home-stats", selectedDate],
    queryFn: () => getHomeStatsQueryFn(selectedDate),
  });
  const { data } = useQuery({
    queryKey: [
      "workout-calendar",
      calendarStart.toISOString(),
      calendarEnd.toISOString(),
    ],
    queryFn: () => getWorkoutCalendarDatesQueryFn(calendarStart, calendarEnd),
  });

  const workoutDates = data?.workoutDates
    ? data.workoutDates.map((dateStr) => new Date(dateStr))
    : undefined;

  return (
    <SafeAreaScreen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* {Header Section} */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="-ml-4 h-11 w-16 overflow-hidden">
              <Image
                className="h-full w-full"
                resizeMode="cover"
                source={logo}
              />
            </View>
            <Text
              accessibilityRole="header"
              className="font-inter-bold text-[22px] tracking-[-0.5px] text-foreground"
            >
              MyWorkout
            </Text>
          </View>
          <Pressable
            className="h-11 flex-row items-center rounded-full border border-border bg-card px-3 active:bg-muted"
            //onPress={showStreak}
          >
            <Image
              className="h-6 w-6"
              resizeMode="contain"
              source={streakIcon}
            />
            <Text className="ml-1.5 font-inter-bold text-[14px] text-foreground">
              {0}
            </Text>
          </Pressable>
        </View>

        {/* {Week Calendar Section} */}
        <WeekCalendar
          markedDates={workoutDates}
          onChange={setSelectedDate}
          value={selectedDate}
        />

        <HomeStats
          avgTimeSeconds={stats?.avgTimeSeconds}
          isPending={isPending}
          totalTimeSeconds={stats?.totalTimeSeconds}
          workouts={stats?.workouts}
        />

        <MyWorkouts />

        <RecentWorkout />

        <WorkoutTemplates />
      </ScrollView>
    </SafeAreaScreen>
  );
}
