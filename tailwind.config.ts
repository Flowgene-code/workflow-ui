import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc", // light background
        foreground: "#1e293b", // slate-800
        primary: {
          DEFAULT: "#4f46e5", // indigo-600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#e0f2fe", // sky-100
          foreground: "#0369a1", // sky-700
        },
        accent: {
          DEFAULT: "#e2e8f0", // slate-200
          foreground: "#1e293b", // slate-800
        },
        destructive: "#dc2626", // red-600
        ring: "#93c5fd", // blue-300
        input: "#f1f5f9", // slate-100
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1e293b",
            h1: {
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "0.5em",
            },
            h2: {
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "0.5em",
            },
            p: {
              fontSize: "1rem",
              lineHeight: "1.75",
              marginBottom: "1em",
            },
            a: {
              color: "#4f46e5",
              textDecoration: "underline",
              fontWeight: "500",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
