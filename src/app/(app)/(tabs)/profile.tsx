import { Feather } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { useColorScheme } from "nativewind";
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";

import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { AuthSession } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useAppThemeColor } from "@/theme/app-theme";

const LEGAL_ORIGIN = "https://techwithemma.com";
const PRIVACY_URL = `${LEGAL_ORIGIN}/`;
const TERMS_URL = `${LEGAL_ORIGIN}/`;

export default function ProfilePage() {
  //const router = useRouter();
  const { data } = authClient.useSession();
  const session = data as AuthSession;

  const { colorScheme, setColorScheme } = useColorScheme();
  const primary = useAppThemeColor("primary");
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const changeColorScheme = (value: boolean) => {
    setIsDarkMode(value);
    setColorScheme(value ? "dark" : "light");
  };

  const name = session?.user.name ?? "User";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const soon = () => Alert.alert("Coming soon");

  const signOut = async () => {
    const { error } = await authClient.signOut();
    //router.replace("/sign-in");
    if (error) {
      Alert.alert("Could not sign out", error.message);
    }
  };

  const confirmDelete = () =>
    Alert.alert(
      "Delete your account?",
      "Your profile, workouts, and history will be permanently deleted. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Connect the API",
              "The delete-account endpoint must be connected before release.",
            ),
        },
      ],
    );

  return (
    <SafeAreaScreen>
      <ScrollView contentContainerClassName="px-5 pb-8">
        <Text className="pt-3 font-inter-bold text-[24px] text-foreground">
          Profile
        </Text>

        <View className="mt-5 flex-row items-center rounded-xl border border-border bg-card p-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Text className="font-inter-bold text-[18px] text-primary-foreground">
              {initials}
            </Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-inter-bold text-[17px] text-foreground">
              {name}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              {session?.user.email}
            </Text>
          </View>
          <Pressable onPress={soon}>
            <Text className="font-inter-semibold text-[12px] text-primary">
              Edit
            </Text>
          </Pressable>
        </View>

        <Section title="Preferences">
          <Row icon="activity" label="Weight Unit" onPress={soon} value="kg" />
          <Row icon="bell" label="Notifications" onPress={soon} />
          <Row
            icon="moon"
            label="Dark Mode"
            right={
              <Switch
                onValueChange={changeColorScheme}
                trackColor={{ false: "#CBD5E1", true: primary }}
                value={isDarkMode}
              />
            }
          />
        </Section>

        <Section title="Support & Legal">
          <Row icon="help-circle" label="Help & Support" onPress={soon} />
          <Row
            icon="shield"
            label="Privacy Policy"
            onPress={() => openBrowserAsync(PRIVACY_URL)}
          />
          <Row
            icon="file-text"
            label="Terms of Service"
            onPress={() => openBrowserAsync(TERMS_URL)}
          />
          <Row icon="info" label="App Version" value="1.0.0" />
        </Section>

        <Section title="Account">
          <Row icon="log-out" label="Sign Out" onPress={signOut} />
          <Row
            danger
            icon="trash-2"
            label="Delete Account"
            onPress={confirmDelete}
          />
        </Section>
      </ScrollView>
    </SafeAreaScreen>
  );
}

type RowProps = {
  danger?: boolean;
  icon: ComponentProps<typeof Feather>["name"];
  label: string;
  onPress?: () => void;
  right?: ReactNode;
  value?: string;
};

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <View className="mt-6">
      <Text className="mb-2 ml-1 font-inter-semibold text-[12px] uppercase tracking-wide text-muted-foreground">
        {title}
      </Text>
      <View className="overflow-hidden rounded-xl border border-border bg-card">
        {children}
      </View>
    </View>
  );
}

function Row({ danger, icon, label, onPress, right, value }: RowProps) {
  const muted = useAppThemeColor("mutedForeground");
  const color = danger ? "#EF4444" : muted;

  return (
    <Pressable
      className="min-h-16 flex-row items-center border-b border-border px-4 active:bg-muted"
      disabled={!onPress}
      onPress={onPress}
    >
      <Feather color={color} name={icon} size={19} />
      <Text
        className={`ml-3 flex-1 font-inter-medium text-[14px] ${danger ? "text-destructive" : "text-foreground"}`}
      >
        {label}
      </Text>
      {value && (
        <Text className="font-inter text-[12px] text-muted-foreground">
          {value}
        </Text>
      )}
      {right}
      {onPress && !right && (
        <Feather color={muted} name="chevron-right" size={19} />
      )}
    </Pressable>
  );
}
