import {type Config} from "tailwindcss";

const config = {
  content: ["./src/**/*.tsx"],
  presets: [require("@echo-webkom/tailwind-config")],
} satisfies Config;

module.exports = config;
