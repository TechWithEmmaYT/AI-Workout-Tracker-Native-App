import { WorkoutDraftProvider } from "@/contexts/workout-draft-context";
import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <WorkoutDraftProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="create"
          options={{
            animation: "slide_from_bottom",
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="[id]/index"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="[id]/active"
          options={{
            animation: "slide_from_bottom",
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="exercises/index"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="exercises/[id]"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </WorkoutDraftProvider>
  );
}
