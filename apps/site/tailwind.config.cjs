/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        echo: {
          blue: {
            dark: "#008FA3",
            light: "#53ADBD",
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
