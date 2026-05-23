/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};
