import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function PublicLayout() {
  const { colorScheme } = useColorScheme();
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle,
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          statusBarStyle: "light",
        }}
      />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
