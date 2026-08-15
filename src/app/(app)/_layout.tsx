import { Stack } from "expo-router";

export default function Applayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modal)/workout" />
      <Stack.Screen name="(modal)/history/[id]" />
    </Stack>
  );
}
