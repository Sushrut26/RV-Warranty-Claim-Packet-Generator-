import type { Config } from "tailwindcss";

// Colors are driven by CSS custom properties (see app/globals.css) so the whole
// UI themes light/dark from one token set. Utilities like `bg-surface`,
// `text-ink`, `border-line`, `text-brand-text` resolve to those tokens.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        brand: {
          DEFAULT: "var(--brand)",
          strong: "var(--brand-strong)",
          text: "var(--brand-text)",
        },
        "on-brand": "var(--on-brand)",
        accent: {
          DEFAULT: "var(--accent)",
          strong: "var(--accent-strong)",
          tint: "var(--accent-tint)",
        },
        good: { DEFAULT: "var(--good)", tint: "var(--good-tint)" },
        bad: { DEFAULT: "var(--bad)", tint: "var(--bad-tint)" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 26, 36, 0.06), 0 1px 3px rgba(16, 26, 36, 0.04)",
        lift: "0 6px 20px -8px rgba(16, 26, 36, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
