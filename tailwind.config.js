/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        vivo: {
          50:  "#e8f0fd",
          100: "#c5d6fa",
          200: "#9eb9f5",
          300: "#6f97ee",
          400: "#4d7fe8",
          500: "#1a60e0",
          600: "#0052cc",   // primary brand
          700: "#003d99",
          800: "#002b73",
          900: "#001a4d",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      boxShadow: {
        card:  "0 2px 12px rgba(0,52,204,0.09)",
        "card-lg": "0 8px 32px rgba(0,52,204,0.13)",
        focus: "0 0 0 3px rgba(0,82,204,0.18)",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },
    },
  },
  plugins: [],
};
