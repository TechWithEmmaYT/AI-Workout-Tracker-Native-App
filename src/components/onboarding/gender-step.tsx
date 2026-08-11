import { OnboardingGender } from "@/lib/validations/onboarding-validation";
import { useAppThemeColor } from "@/theme/app-theme";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import OnboardingOptionCard from "./onboarding-option-card";

type GenderStepProps = {
  onSelect: (value: OnboardingGender) => void;
  value?: OnboardingGender;
};

const genderOptions = [
  {
    icon: "mars",
    label: "Male",
    value: "male",
  },
  {
    icon: "venus",
    label: "Female",
    value: "female",
  },
] as const;

const GenderStep = ({ value, onSelect }: GenderStepProps) => {
  const foreground = useAppThemeColor("foreground");
  const primary = useAppThemeColor("primary");

  return (
    <View className="flex-1">
      <Animated.View entering={FadeInRight.duration(250)}>
        <Text
          className="mt-6 max-w-72 font-inter-bold text-[28px] leading-9 
        tracking-[-0.6px] text-foreground"
        >
          What&apos;s your gender?
        </Text>
        <Text className="mt-2 max-w-72 font-inter text-[15px] leading-6 text-muted-foreground">
          This helps us personalize your experience.
        </Text>
      </Animated.View>

      <View className="mt-8 gap-4">
        {genderOptions.map((option, index) => {
          const selected = value === option.value;
          return (
            <OnboardingOptionCard
              key={option.value}
              delay={(index + 1) * 80}
              icon={
                <FontAwesome6
                  color={selected ? primary : foreground}
                  name={option.icon}
                  size={31}
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
};

export default GenderStep;
