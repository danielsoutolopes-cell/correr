import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090D16",
        foreground: "#F3F4F6",
        card: {
          DEFAULT: "#111827",
          foreground: "#F9FAFB",
          border: "#1F2937",
        },
        popover: {
          DEFAULT: "#111827",
          foreground: "#F9FAFB",
        },
        primary: {
          DEFAULT: "#3B82F6", // Treino / Speed Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1F2937",
          foreground: "#F9FAFB",
        },
        muted: {
          DEFAULT: "#1F2937",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#374151",
          foreground: "#F9FAFB",
        },
        // Specialized Sports Palettes
        bio: {
          nutrition: "#10B981", // Emerald Neon
          training: "#3B82F6",  // Electric Blue
          mind: "#8B5CF6",      // Zen Violet
          flamengo: "#EF4444",  // Rubro-Negro Scarlet
          gremio: "#0D80BF",    // Tricolor Sky Blue
          raceP1: "#F59E0B",    // Marathon Gold
          dark: "#090D16",
          card: "#111827",
          cardLight: "#161F33",
          border: "#1E293B",
          treadmill: "#06B6D4", // Cyan
          strength: "#F97316",  // Orange Iron
          bike: "#EAB308",      // Amber
        },
        border: "#1F2937",
        input: "#1F2937",
        ring: "#3B82F6",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-red": "glowRed 2s ease-in-out infinite",
        "glow-blue": "glowBlue 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        glowRed: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" },
          "50%": { boxShadow: "0 0 25px rgba(239, 68, 68, 0.8)" },
        },
        glowBlue: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(13, 128, 191, 0.4)" },
          "50%": { boxShadow: "0 0 25px rgba(13, 128, 191, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
