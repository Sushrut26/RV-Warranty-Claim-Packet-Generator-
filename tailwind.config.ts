import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Field tool" palette: steel/slate + a workmanlike amber accent.
        brand: {
          DEFAULT: "#1e3a5f",
          dark: "#152a45",
          light: "#2c4f7c",
        },
        accent: {
          DEFAULT: "#d97706",
          dark: "#b45309",
        },
      },
    },
  },
  plugins: [],
};

export default config;
