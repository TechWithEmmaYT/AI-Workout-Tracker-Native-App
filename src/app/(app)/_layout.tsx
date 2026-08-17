import { StreakProvider } from "@/contexts/streak-context";
import { Stack } from "expo-router";

export default function Applayout() {
  return (
    <StreakProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(modal)/workout"
          //UPDATED the mode presentation here
          options={{
            animation: "slide_from_bottom",
            presentation: "fullScreenModal",
          }}
        />
        <Stack.Screen name="(modal)/history/[id]" />
      </Stack>
    </StreakProvider>
  );
}
