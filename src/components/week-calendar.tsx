import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { cn } from "@/lib/utils";

type WeekCalendarProps = {
  markedDates?: Date[];
  onChange?: (date: Date) => void;
  value?: Date;
};

export default function WeekCalendar({
  markedDates = [],
  onChange,
  value,
}: WeekCalendarProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const today = startOfDay(new Date());

  const [internal, setInternal] = useState(today);
  const selected = value ?? internal;

  const weeks = eachWeekOfInterval({
    start: subWeeks(startOfWeek(today), 2),
    end: endOfWeek(today),
  }).map((weekStart) =>
    eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart),
    }),
  );

  const selectDate = (date: Date) => {
    setInternal(date);
    onChange?.(date);
  };

  return (
    <ScrollView
      className="-mx-5 mt-5 flex-grow-0"
      horizontal
      onContentSizeChange={() =>
        scrollRef.current?.scrollToEnd({ animated: false })
      }
      pagingEnabled
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
    >
      {weeks.map((week) => (
        <View
          className="flex-row gap-1.5 px-5"
          key={week[0].getTime()}
          style={{ width }}
        >
          {week.map((date) => {
            const isSelected = isSameDay(date, selected);
            const isFuture = isAfter(date, today);
            const isToday = isSameDay(date, today);

            // Check whether this calendar day contains
            // at least one completed workout.
            const hasWorkout = markedDates.some((markedDate) =>
              isSameDay(markedDate, date),
            );

            return (
              <Pressable
                accessibilityLabel={date.toLocaleDateString("en-US", {
                  dateStyle: "full",
                })}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isFuture,
                  selected: isSelected,
                }}
                className={cn(
                  "h-[88px] flex-1 items-center justify-center rounded-2xl border",
                  isSelected
                    ? "border-primary bg-card"
                    : "border-border bg-background/80",
                  isFuture && "opacity-40",
                )}
                disabled={isFuture}
                key={date.getTime()}
                onPress={() => selectDate(date)}
              >
                <Text className="font-inter-medium text-[10px] text-muted-foreground">
                  {format(date, "EE").toUpperCase()}
                </Text>
                <Text className="mt-2 font-inter-bold text-[16px] text-foreground">
                  {format(date, "dd")}
                </Text>
                <View
                  className={cn(
                    "mt-2 h-1.5 w-1.5 rounded-full",
                    hasWorkout
                      ? "bg-primary"
                      : isToday
                        ? "bg-border"
                        : "bg-transparent",
                  )}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}
