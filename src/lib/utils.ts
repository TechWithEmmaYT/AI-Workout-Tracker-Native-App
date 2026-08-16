export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStatusBarStyle(
  pathname: string,
  scheme: "light" | "dark",
): "light" | "dark" {
  const segments = pathname.split("/").filter(Boolean);
  const isWorkoutDetail =
    segments[0] === "workout" &&
    segments.length === 2 &&
    !["create", "exercises"].includes(segments[1]);
  const isExerciseDetail =
    segments[0] === "workout" &&
    segments[1] === "exercises" &&
    segments.length === 3;

  return pathname === "/welcome" || isWorkoutDetail || isExerciseDetail
    ? "light"
    : scheme === "dark"
      ? "light"
      : "dark";
}
