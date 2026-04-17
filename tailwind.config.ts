import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          night: "#111111",
          graphite: "#1C1C1C",
          green: "#16A34A",
          greenDark: "#0E7A36",
          greenSoft: "#22C55E",
          white: "#FFFFFF",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        display: ["'Great Vibes'", "'Allura'", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,197,94,0.3), 0 10px 30px -12px rgba(34,197,94,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
