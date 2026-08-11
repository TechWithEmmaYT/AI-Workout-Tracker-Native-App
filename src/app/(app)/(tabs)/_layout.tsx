import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Tablayout() {
  const insets = useSafeAreaInsets();
  const tabBackground = useAppThemeColor("tabBackground");
  const primary = useAppThemeColor("primary");
  const mutedForeground = useAppThemeColor("mutedForeground");
  const border = useAppThemeColor("border");
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: tabBackground,
          bottom: insets.bottom + 12,
          height: 66,
          left: 13,
          paddingBottom: 7,
          paddingTop: 6,
          borderRadius: 50,
          marginHorizontal: 10,
          shadowColor: "#333",
          borderColor: border,
          borderWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="home" size={21} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          tabBarAccessibilityLabel: "Workouts tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="activity" size={21} />
          ),
          title: "Workouts",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarButton: ({ onPress }) => (
            <Pressable
              className="flex-1 items-center justify-center"
              onPress={onPress}
            >
              <View className="-mt-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg">
                <Feather color="white" name="plus" size={27} />
              </View>
            </Pressable>
          ),
          tabBarLabel: () => null,
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarAccessibilityLabel: "History tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="calendar" size={21} />
          ),
          title: "History",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: "Profile tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="user" size={21} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
