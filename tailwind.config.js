/** @type {import('tailwindcss').Config} */

const color = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: color("accent"),
        background: color("background"),
        border: color("border"),
        card: color("card"),
        destructive: {
          DEFAULT: color("destructive"),
          foreground: color("destructive-foreground"),
        },
        foreground: color("foreground"),
        input: color("input"),
        "input-border": color("input-border"),
        muted: {
          DEFAULT: color("muted"),
          foreground: color("muted-foreground"),
        },
        overlay: color("overlay"),
        primary: {
          DEFAULT: color("primary"),
          foreground: color("primary-foreground"),
          hover: color("primary-hover"),
        },
        ring: color("ring"),
        secondary: {
          DEFAULT: color("secondary"),
          foreground: color("secondary-foreground"),
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-bold": ["Inter_700Bold"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
      },
    },
  },
  plugins: [],
};
