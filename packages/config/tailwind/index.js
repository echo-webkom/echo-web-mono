const plugin = require("tailwindcss/plugin");
const {fontFamily} = require("tailwindcss/defaultTheme");
const {blackA, mauve, violet, indigo, purple} = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      primary: ["var(--inter-font)", ...fontFamily.sans],
      sans: ["var(--inter-font)", ...fontFamily.sans],
      mono: ["var(--ibm-font)", ...fontFamily.mono],
      display: ["var(--inter-display-font)", ...fontFamily.sans],
    },
    extend: {
      colors: {
        // Custom colors
        black: "#1d1d1d",
        white: "#f9fafb",
        navy: "#171923",
        echo: {
          blue: "#008fa3",
          yellow: "#fed879",
          blue2: "#53adbd",
          yellow2: "#ffeabb",
        },

        // Radix colors
        ...blackA,
        ...mauve,
        ...violet,
        ...purple,
        ...indigo,
      },
      keyframes: {
        enterFromRight: {
          from: {opacity: 0, transform: "translateX(200px)"},
          to: {opacity: 1, transform: "translateX(0)"},
        },
        enterFromLeft: {
          from: {opacity: 0, transform: "translateX(-200px)"},
          to: {opacity: 1, transform: "translateX(0)"},
        },
        exitToRight: {
          from: {opacity: 1, transform: "translateX(0)"},
          to: {opacity: 0, transform: "translateX(200px)"},
        },
        exitToLeft: {
          from: {opacity: 1, transform: "translateX(0)"},
          to: {opacity: 0, transform: "translateX(-200px)"},
        },
        scaleIn: {
          from: {opacity: 0, transform: "rotateX(-10deg) scale(0.9)"},
          to: {opacity: 1, transform: "rotateX(0deg) scale(1)"},
        },
        scaleOut: {
          from: {opacity: 1, transform: "rotateX(0deg) scale(1)"},
          to: {opacity: 0, transform: "rotateX(-10deg) scale(0.95)"},
        },
        fadeIn: {
          from: {opacity: 0},
          to: {opacity: 1},
        },
        fadeOut: {
          from: {opacity: 1},
          to: {opacity: 0},
        },
      },
      animation: {
        scaleIn: "scaleIn 200ms ease",
        scaleOut: "scaleOut 200ms ease",
        fadeIn: "fadeIn 200ms ease",
        fadeOut: "fadeOut 200ms ease",
        enterFromLeft: "enterFromLeft 250ms ease",
        enterFromRight: "enterFromRight 250ms ease",
        exitToLeft: "exitToLeft 250ms ease",
        exitToRight: "exitToRight 250ms ease",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    plugin(({matchUtilities}) => {
      matchUtilities({
        perspective: (value) => ({
          perspective: value,
        }),
      });
    }),
  ],
};
