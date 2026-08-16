import { WorkoutDraftProvider } from "@/contexts/workout-draft-context";
import { Stack } from "expo-router";

//UPDATE: Screens use the platform's default animation; the active workout uses a fade. (you can change it if you want)

export default function WorkoutLayout() {
  return (
    <WorkoutDraftProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="create"
          //Modal presentation moved to the parent app stack.
          // options={{
          //     animation: "slide_from_bottom",
          //     presentation: "fullScreenModal",
          //   }}
        />
        <Stack.Screen
          name="[id]/index"
          // options={{
          //   animation: "slide_from_right",
          // }}
        />
        <Stack.Screen
          name="[id]/active"
          options={{
            animation: "fade",
            // The parent stack already presents it as modal.
            //presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen
          name="exercises/index"
          // options={{
          //   animation: "slide_from_right",
          // }}
        />
        <Stack.Screen
          name="exercises/[id]"
          // options={{
          //   animation: "slide_from_right",
          // }}
        />
      </Stack>
    </WorkoutDraftProvider>
  );
}
