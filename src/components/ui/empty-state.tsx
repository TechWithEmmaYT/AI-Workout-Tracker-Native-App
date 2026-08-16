import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";

type EmtyStateProps = {
  icon?: ComponentProps<typeof Feather>["name"];
  message: string;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export default function EmtyState({
  icon = "wifi-off",
  message,
  className,
  onRetry,
  retryLabel = "Try Again",
}: EmtyStateProps) {
  const mutedForeground = useAppThemeColor("mutedForeground");

  return (
    <View
      className={cn(
        "items-center py-10 rounded-2xl bg-card border border-border shadow-xs",
        className && className,
      )}
    >
      <Feather color={mutedForeground} name={icon} size={28} />
      <Text className="mt-3 text-center font-inter-semibold text-foreground">
        {message}
      </Text>
      {onRetry ? (
        <Button className="mt-5" onPress={onRetry} variant="outline">
          {retryLabel}
        </Button>
      ) : null}
    </View>
  );
}
