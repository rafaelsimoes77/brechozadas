import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    path.join(__dirname, "src/pages/**/*.{js,ts,jsx,tsx,mdx}"),
    path.join(__dirname, "src/components/**/*.{js,ts,jsx,tsx,mdx}"),
    path.join(__dirname, "src/app/**/*.{js,ts,jsx,tsx,mdx}"),
    path.join(__dirname, "src/context/**/*.{js,ts,jsx,tsx,mdx}"),
  ],
  theme: {
    extend: {
      colors: {
        concrete: {
          DEFAULT: "#F6F4EF",
          50: "#FAF9F6",
          100: "#F6F4EF",
          200: "#EAE6DC",
          300: "#D5CFC2",
          /* Cinza escuro de alto contraste para leitura nítida */
          500: "#4A463F",
        },
        ink: {
          DEFAULT: "#141414",
          800: "#1E1E1E",
          700: "#2C2C2C",
        },
        rust: {
          DEFAULT: "#C93B1E",
          hover: "#A82E15",
          light: "#FCEAE5",
        },
        neon: {
          DEFAULT: "#EEFF33",
          muted: "#E4F622",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-mono)", "sans-serif"],
      },
      boxShadow: {
        urban: "3px 3px 0px 0px #141414",
        "urban-sm": "2px 2px 0px 0px #141414",
        "urban-rust": "3px 3px 0px 0px #C93B1E",
      },
    },
  },
  plugins: [],
};

export default config;
