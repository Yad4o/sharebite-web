/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#fef3c7", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706" },
      },
    },
  },
  plugins: [],
};
