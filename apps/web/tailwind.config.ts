import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{ts,js,tsx,jsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      primary: ["var(--inter-font)", ...fontFamily.sans],
      sans: ["var(--inter-font)", ...fontFamily.sans],
      mono: ["var(--ibm-font)", ...fontFamily.mono],
      display: ["var(--inter-display-font)", ...fontFamily.sans],
      block: ["var(--block-font)", ...fontFamily.mono],
      ranchers: ["var(--ranchers-font)", ...fontFamily.sans],
      lexend: ["var(--lexend-font)", ...fontFamily.sans],
      unna: ["var(--unna-font)", ...fontFamily.serif],
      radley: ["var(--radley-font)", ...fontFamily.serif],
      slab: ["var(--slab-font)", ...fontFamily.sans],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        banner: "var(--banner)",
        wave: {
          DEFAULT: "var(--wave)",
          foreground: "var(--wave-foreground)",
          dark: "var(--wave-dark)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          hover: "var(--secondary-hover)",
          dark: "var(--secondary-dark)",
        },
        table: {
          foreground: "var(--table-foreground)",
          background: {
            DEFAULT: "var(--table-background)",
            alt: "var(--table-background-alt)",
          },
          header: {
            foreground: "var(--table-header-foreground)",
            background: "var(--table-header-background)",
          },
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
          hover: "var(--destructive-hover)",
          dark: "var(--destructive-dark)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
          dark: "var(--muted-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
          hover: "var(--success-hover)",
          dark: "var(--success-dark)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
          hover: "var(--info-hover)",
          dark: "var(--info-dark)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
          hover: "var(--warning-hover)",
          dark: "var(--warning-dark)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        reaction: {
          DEFAULT: "var(--selected)",
          foreground: "var(--text-foreground)",
        },
        feide: {
          DEFAULT: "var(--feide)",
          hover: "var(--feide-hover)",
          dark: "var(--feide-dark)",
        },
        footer: {
          DEFAULT: "var(--footer)",
          border: "var(--footer-border)",
          foreground: "var(--footer-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(({ matchUtilities }) => {
      const TIME = 6;
      matchUtilities({
        "animate-float-rotate": (value) => {
          const rotate = Number(value);
          const startRotate = `${rotate}deg`;
          const endRotate = `${rotate + 6}deg`;

          return {
            "@keyframes floatAndRotate": {
              "0%, 100%": { transform: `translateY(0) rotate(${startRotate})` },
              "50%": { transform: `translateY(-5%) rotate(${endRotate})` },
            },
            animation: `floatAndRotate ${TIME}s infinite ease-in-out`,
          };
        },
        "animate-float-rotate-reverse": (value) => {
          const rotate = Number(value);
          const startRotate = `${rotate}deg`;
          const endRotate = `${rotate - 6}deg`;

          return {
            "@keyframes floatAndRotateReverse": {
              "0%, 100%": { transform: `translateY(0) rotate(${startRotate})` },
              "50%": { transform: `translateY(-5%) rotate(${endRotate})` },
            },
            animation: `floatAndRotateReverse ${TIME}s infinite ease-in-out`,
          };
        },
      });
    }),
  ],
} satisfies Config;
