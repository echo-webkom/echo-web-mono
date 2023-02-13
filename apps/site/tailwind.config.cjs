/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        echo: {
          blue: {
            dark: "#0396A6",
            light: "#A9D4D9",
          },
          yellow: {
            dark: "#F2B705",
            light: "#F2C777",
          },
          black: "#0D0D0D",
          white: "#eee",
        },
      },
    },
  },
  plugins: [],
};
