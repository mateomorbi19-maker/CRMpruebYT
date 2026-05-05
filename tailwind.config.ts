import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#0F172A",
          paper: "#0A0F1F",
          surface: "#152042",
          border: "#1E2A4D",
          ink: "#E5EAF5",
          black: "#000000",
          muted: "#7E8AAE",
          green: "#3B82F6",
          greenSoft: "#60A5FA",
          greenTint: "#1E3A8A",
          accent: "#1E40AF",
          neon: "#38BDF8",
        },
      },
      fontFamily: {
        display: ["'Great Vibes'", "'Allura'", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.30), 0 8px 24px -12px rgba(0,0,0,0.50)",
        glow: "0 0 0 1px rgba(59,130,246,0.45), 0 12px 40px -12px rgba(59,130,246,0.45)",
        neon: "0 0 0 1px rgba(56,189,248,0.55), 0 0 18px rgba(56,189,248,0.55), 0 0 42px rgba(59,130,246,0.40)",
        "neon-r": "8px 0 24px -4px rgba(56,189,248,0.55), 4px 0 0 0 rgba(56,189,248,0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
