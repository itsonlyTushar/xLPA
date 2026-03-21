/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ededed",
        primary: {
          DEFAULT: "#dc2626",
          hover: "#ef4444",
          dark: "#991b1b",
        },
        surface: {
          DEFAULT: "#111111",
          hover: "#1a1a1a",
        },
        border: "#262626",
        muted: "#737373",
        success: "#22c55e",
        warning: "#eab308",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Fira Code", "Cascadia Code", "monospace"],
      },
    },
  },
  plugins: [],
};
