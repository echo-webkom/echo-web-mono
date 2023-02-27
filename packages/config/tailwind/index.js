/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#f9fafb",
      navy: "#171923",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
