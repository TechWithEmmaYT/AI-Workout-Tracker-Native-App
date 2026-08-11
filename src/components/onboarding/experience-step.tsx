import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { OnboardingExperience } from "@/lib/validations/onboarding-validation";
import { useAppThemeColor } from "@/theme/app-theme";
import OnboardingOptionCard from "./onboarding-option-card";

type ExperienceStepProps = {
  onSelect: (value: OnboardingExperience) => void;
  value?: OnboardingExperience;
};

const experienceOptions = [
  {
    description: "New to training",
    icon: "zap",
    label: "Beginner",
    value: "beginner",
  },
  {
    description: "Trained for a while",
    icon: "target",
    label: "Intermediate",
    value: "intermediate",
  },
  {
    description: "Very experienced",
    icon: "award",
    label: "Advanced",
    value: "advanced",
  },
] as const;

export default function ExperienceStep({
  onSelect,
  value,
}: ExperienceStepProps) {
  const foreground = useAppThemeColor("foreground");
  const primary = useAppThemeColor("primary");

  return (
    <View className="flex-1">
      <Animated.View entering={FadeInRight.duration(250)}>
        <Text
          accessibilityRole="header"
          className="mt-6 max-w-80 font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
        >
          What&apos;s your training experience?
        </Text>
        <Text className="mt-2 max-w-72 font-inter text-[15px] leading-6 text-muted-foreground">
          Select your current experience level.
        </Text>
      </Animated.View>

      <View accessibilityRole="radiogroup" className="mt-6 gap-4">
        {experienceOptions.map((option, index) => {
          const selected = value === option.value;

          return (
            <OnboardingOptionCard
              key={option.value}
              delay={(index + 1) * 80}
              description={option.description}
              icon={
                <Feather
                  color={selected ? primary : foreground}
                  name={option.icon}
                  size={27}
                />
              }
              label={option.label}
              onPress={() => onSelect(option.value)}
              selected={selected}
            />
          );
        })}
      </View>
    </View>
  );
}
