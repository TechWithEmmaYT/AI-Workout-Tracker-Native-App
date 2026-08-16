import { StreakProvider } from "@/contexts/streak-context";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function Applayout() {
  const { colorScheme } = useColorScheme();
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  return (
    <StreakProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          statusBarStyle,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modal)/workout" />
        <Stack.Screen name="(modal)/history/[id]" />
      </Stack>
    </StreakProvider>
  );
}
