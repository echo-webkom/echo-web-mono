import type {Config} from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{tsx,mdx}", "./theme.config.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
