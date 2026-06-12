import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--primary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "#ffffff",
        "card-foreground": "var(--foreground)",
        popover: "#ffffff",
        "popover-foreground": "var(--foreground)",
        primary: {
          DEFAULT: "#7C3AED",
          dark: "#6D28D9",
          light: "#F5F3FF",
          border: "#EDE9FE",
        },
        "primary-foreground": "#ffffff",
        secondary: "#f8fafc",
        "secondary-foreground": "var(--foreground)",
        muted: "#f1f5f9",
        "muted-foreground": "var(--muted)",
        accent: "#f5f3ff",
        "accent-foreground": "var(--foreground)",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
