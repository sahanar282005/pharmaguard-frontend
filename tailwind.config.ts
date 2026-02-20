import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-space-grotesk)"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 8px 2px var(--risk-toxic)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 20px 6px var(--risk-toxic)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "dna-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "dna-rotate": "dna-rotate 20s linear infinite",
      },
    },
  },
  plugins: [],
}

export default config
