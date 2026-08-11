import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type SafeAreaScreenProps = ComponentProps<typeof SafeAreaView>;

export default function SafeAreaScreen({
  className,
  ...props
}: SafeAreaScreenProps) {
  return (
    <SafeAreaView
      className={cn("flex-1 bg-background", className)}
      {...props}
    />
  );
}
