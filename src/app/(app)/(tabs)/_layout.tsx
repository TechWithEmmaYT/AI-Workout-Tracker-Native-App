//import { NativeTabs } from "expo-router/native-tabs";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Tablayout() {
  const router = useRouter();
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
          marginHorizontal: 12,
          position: "relative",
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
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/workout/create");
          },
        }}
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
          tabBarAccessibilityLabel: "Create workout",
          tabBarLabel: () => null,
          title: "",
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

// For Ios Simulator Test NativeTab
// function IOSTabLayout() {
//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="house" />
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="workouts">
//         <NativeTabs.Trigger.Label>Workouts</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="figure.strengthtraining.traditional" />
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="create">
//         <NativeTabs.Trigger.Label>Create</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="plus.circle.fill" />
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="history">
//         <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="calendar" />
//       </NativeTabs.Trigger>

//       <NativeTabs.Trigger name="profile">
//         <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
//         <NativeTabs.Trigger.Icon sf="person" />
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }

// export default function TabLayout() {
//   return Platform.OS === "ios" ? <IOSTabLayout /> : <></>
// }
