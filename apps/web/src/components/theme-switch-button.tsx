"use client";

import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  function toggleTheme() {
    setTheme(isDarkMode ? "light" : "dark");
  }

  return (
    <button onClick={toggleTheme} className="h-8 w-8">
      <LuMoon className="block h-full w-full p-1 dark:hidden" />
      <LuSun className="hidden h-full w-full p-1 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
