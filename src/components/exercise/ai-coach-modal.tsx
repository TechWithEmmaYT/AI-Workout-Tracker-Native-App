import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/button";
import Skeleton from "@/components/ui/skeleton";
import { getExerciseInstructionsQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";

type AiCoachModalProps = {
  exercise: {
    description: string;
    id: string;
    instructions?: readonly string[];
    name: string;
  };
  onClose: () => void;
  visible: boolean;
};

export default function AiCoachModal({
  exercise,
  onClose,
  visible,
}: AiCoachModalProps) {
  const foreground = useAppThemeColor("foreground");

  const { data, isPending } = useQuery({
    enabled: visible && Boolean(exercise.id),
    queryFn: () => getExerciseInstructionsQueryFn(exercise.id),
    queryKey: ["exercise-instructions", exercise.id],
  });

  const instructions = data?.instructions ??
    exercise.instructions ?? [exercise.description];

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-end bg-overlay/60">
        <SafeAreaView
          className="max-h-[86%] rounded-t-[28px] bg-card"
          edges={["bottom"]}
        >
          <View className="items-center pt-3">
            <View className="h-1.5 w-12 rounded-full bg-border" />
          </View>

          <ScrollView
            contentContainerClassName="px-5 pb-4 pt-5"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Feather color={foreground} name="message-circle" size={24} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-inter-bold text-[20px] text-foreground">
                  AI Coach
                </Text>
                <Text className="mt-0.5 font-inter text-[12px] text-muted-foreground">
                  How to perform {exercise.name}
                </Text>
              </View>
            </View>

            <View className="mt-5 rounded-2xl border border-border bg-card p-4">
              <Text className="font-inter-semibold text-[14px] text-foreground">
                Step-by-step guidance
              </Text>

              {isPending ? (
                <View className="mt-4 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </View>
              ) : (
                <View className="mt-4 gap-4">
                  {instructions.map((instruction, index) => (
                    <View
                      className="flex-row"
                      key={`${index}-${instruction.slice(0, 15)}`}
                    >
                      <View className="h-7 w-7 items-center justify-center rounded-full bg-secondary">
                        <Text className="font-inter-semibold text-[12px] text-secondary-foreground">
                          {index + 1}
                        </Text>
                      </View>
                      <Text className="ml-3 flex-1 font-inter text-[13px] leading-5 text-foreground">
                        {instruction}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View className="mt-4 flex-row rounded-2xl bg-muted p-4">
              <Feather color={foreground} name="info" size={20} />
              <Text className="ml-3 flex-1 font-inter text-[12px] leading-5 text-muted-foreground">
                Use a manageable weight and controlled range of motion. Stop if
                you feel sharp pain. This is general fitness guidance, not
                medical advice.
              </Text>
            </View>
          </ScrollView>

          <View className="border-t border-border px-5 pb-2 pt-3">
            <Button
              accessibilityLabel="Close AI Coach"
              onPress={onClose}
              variant="secondary"
            >
              Got It
            </Button>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
