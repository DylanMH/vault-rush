import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          900: "#0a0e17",
          800: "#111827",
          700: "#1f2937",
          600: "#374151",
          500: "#6b7280",
          400: "#9ca3af",
          300: "#d1d5db",
          gold: "#f59e0b",
          goldLight: "#fbbf24",
          gem: "#10b981",
          gemLight: "#34d399",
          danger: "#ef4444",
          dangerLight: "#f87171",
          accent: "#8b5cf6",
          accentLight: "#a78bfa",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shake": "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        "pop": "pop 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.3s ease-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        pop: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #f59e0b, 0 0 10px #f59e0b" },
          "100%": { boxShadow: "0 0 20px #f59e0b, 0 0 40px #f59e0b" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
