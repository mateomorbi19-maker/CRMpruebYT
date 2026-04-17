import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#FFFFFF",
          paper: "#FAFAF9",
          surface: "#F3F6F3",
          border: "#E5E7EB",
          ink: "#0B0F0D",
          black: "#000000",
          muted: "#6B7280",
          green: "#15803D",
          greenSoft: "#16A34A",
          greenTint: "#DCFCE7",
        },
      },
      fontFamily: {
        display: ["'Great Vibes'", "'Allura'", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,15,13,0.04), 0 8px 24px -12px rgba(11,15,13,0.10)",
        glow: "0 0 0 1px rgba(22,163,74,0.35), 0 12px 40px -12px rgba(22,163,74,0.30)",
      },
    },
  },
  plugins: [],
};

export default config;
