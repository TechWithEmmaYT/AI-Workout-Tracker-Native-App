import {
    OnboardingValues,
    onboardingValuesSchema,
} from "@/lib/validations/onboarding-validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const ONBOARDING_KEYS = "myworkout_onboarding_answers";
export const answers: Partial<OnboardingValues> = {};

export const steps = [
  { field: "gender", key: "gender" },
  { field: "goal", key: "goal" },
  { field: "experience", key: "experience" },
] as const;
const isClient = Platform.OS !== "web" || typeof window !== "undefined";

if (isClient) {
  AsyncStorage.getItem(ONBOARDING_KEYS)
    .then((data) => data && Object.assign(answers, JSON.parse(data)))
    .catch(() => {});
}

export const saveOnboardingAnswer = (
  field: keyof OnboardingValues,
  value: any,
) => {
  answers[field] = value;
  if (isClient)
    AsyncStorage.setItem(ONBOARDING_KEYS, JSON.stringify(answers)).catch(
      () => {},
    );
};

export const isOnboardingCompleted = (): boolean => {
  return onboardingValuesSchema.safeParse(answers).success;
};

export const getOnboardingAnswers = () => {
  return onboardingValuesSchema.safeParse(answers);
};

export const resetOnboardingAnswers = () => {
  steps.forEach((s) => delete answers[s.field]);
  if (isClient) AsyncStorage.removeItem(ONBOARDING_KEYS).catch(() => {});
};

export const stepIndex = (key: string) => steps.findIndex((s) => s.key === key);
