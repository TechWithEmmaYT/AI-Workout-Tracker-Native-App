import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import HomeSectionHeader from "./home-section-header";

const images = {
  legs: require("../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../assets/images/workouts/pull-day.png"),
  push: require("../../../assets/images/workouts/push-day.png"),
};

const templates = [
  { id: 1, image: images.pull, title: "Upper Body", workouts: 12 },
  { id: 2, image: images.legs, title: "Lower Body", workouts: 10 },
  { id: 3, image: images.push, title: "Full Body", workouts: 14 },
];

export default function WorkoutTemplates() {
  const router = useRouter();

  return (
    <View className="mt-4">
      <HomeSectionHeader title="Workout Templates" showViewAll={false} />
      <ScrollView
        className="-mx-5"
        contentContainerClassName="gap-2 px-5"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {templates.map((template) => (
          <Pressable
            className="h-[116px] w-[104px] overflow-hidden rounded-xl bg-muted active:opacity-85"
            key={template.id}
            onPress={() => router.push("/workouts")}
          >
            <Image
              className="absolute inset-0 h-full w-full"
              source={template.image}
            />
            <View className="absolute inset-x-0 bottom-0 bg-overlay/70 px-2.5 pb-2.5 pt-6">
              <Text className="font-inter-semibold text-[12px] text-white">
                {template.title}
              </Text>
              <Text className="mt-0.5 font-inter text-[10px] text-white/80">
                {template.workouts} Workouts
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
