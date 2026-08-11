import { ActivityIndicator, Modal, Text, View } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

export default function LoadingModal({
  message = "Loading...",
  visible,
}: {
  message?: string;
  visible: boolean;
}) {
  const primary = useAppThemeColor("primary");

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="flex-1 items-center justify-center bg-overlay/40">
        <View className="w-44 items-center rounded-2xl bg-card p-5">
          <ActivityIndicator color={primary} />
          <Text className="mt-3 font-inter-medium text-[13px] text-foreground">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
