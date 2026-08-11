import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

type OnboardingOptionCardProps = {
  delay?: number;
  description?: string;
  icon: ReactNode;
  label: string;
  onPress: () => void;
  selected: boolean;
};

const OnboardingOptionCard = ({
  delay = 0,
  description,
  icon,
  label,
  onPress,
  selected,
}: OnboardingOptionCardProps) => {
  const primaryForeground = useAppThemeColor("primaryForeground");
  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(250)}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        className={cn(
          "min-h-20 flex-row items-center rounded-xl border bg-card px-5 py-4",
          selected ? "border-primary" : "border-border",
        )}
        onPress={onPress}
      >
        <View className="size-10 items-center justify-center">{icon}</View>
        <View className="ml-4 flex-1 flex-row justify-between">
          <Text
            className={cn(
              "font-inter-semibold text-[15px] leading-5",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {label}
          </Text>

          {selected ? (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Feather color={primaryForeground} name="check" size={15} />
            </View>
          ) : (
            <View className="h-6 w-6 rounded-full border-2 border-input-border" />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default OnboardingOptionCard;
