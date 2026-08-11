import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const router = useRouter();

  const signOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      Alert.alert("Could not sign out", error.message);
    }
    router.replace("/sign-in");
  };
  return (
    <SafeAreaView>
      <View className="flex-grow items-center justify-center ">
        <Text>Index</Text>

        <Pressable className="p-5" onPress={signOut}>
          <Text>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Index;
