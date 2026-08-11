import { useColorScheme, vars } from "nativewind";

const brand = {
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  primary: "#2563EB",
  primaryForeground: "#FFFFFF",
  primaryHover: "#1D4ED8",
} as const;

export const appThemeColors = {
  light: {
    ...brand,
    accent: "#EFF6FF",
    background: "#f6f6f6",
    border: "#E2E8F0",
    card: "#FFFFFF",
    tabBackground: "#FFFFFF",
    foreground: "#0F172A",
    input: "#FFFFFF",
    inputBorder: "#E2E8F0",
    muted: "#F1F5F9",
    mutedForeground: "#64748B",
    overlay: "#0F172A",
    ring: "#3B82F6",
    secondary: "#F1F5F9",
    secondaryForeground: "#0F172A",
  },
  dark: {
    ...brand,
    accent: "#2563EB",
    background: "#0B0F19",
    border: "#242C3E",
    card: "#161D2E",
    tabBackground: "#161D2E",
    foreground: "#F8FAFC",
    input: "#161D2E",
    inputBorder: "#2E3750",
    muted: "#1C2436",
    mutedForeground: "#8B94A8",
    overlay: "#000000",
    ring: "#3B82F6",
    secondary: "#1C2436",
    secondaryForeground: "#F1F5F9",
  },
} as const;

export type AppThemeColor = keyof (typeof appThemeColors)["light"];

type ThemeColors = Record<AppThemeColor, string>;

const rgb = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${value >> 16} ${(value >> 8) & 255} ${value & 255}`;
};

const createTheme = (colors: ThemeColors) =>
  vars({
    "--color-accent": rgb(colors.accent),
    "--color-background": rgb(colors.background),
    "--color-border": rgb(colors.border),
    "--color-card": rgb(colors.card),
    "--color-destructive": rgb(colors.destructive),
    "--color-destructive-foreground": rgb(colors.destructiveForeground),
    "--color-foreground": rgb(colors.foreground),
    "--color-input": rgb(colors.input),
    "--color-input-border": rgb(colors.inputBorder),
    "--color-muted": rgb(colors.muted),
    "--color-muted-foreground": rgb(colors.mutedForeground),
    "--color-overlay": rgb(colors.overlay),
    "--color-primary": rgb(colors.primary),
    "--color-primary-foreground": rgb(colors.primaryForeground),
    "--color-primary-hover": rgb(colors.primaryHover),
    "--color-ring": rgb(colors.ring),
    "--color-secondary": rgb(colors.secondary),
    "--color-secondary-foreground": rgb(colors.secondaryForeground),
  });

export const appThemes = {
  dark: createTheme(appThemeColors.dark),
  light: createTheme(appThemeColors.light),
};

export function useAppThemeColor(color: AppThemeColor) {
  const { colorScheme } = useColorScheme();

  return appThemeColors[colorScheme === "dark" ? "dark" : "light"][color];
}
