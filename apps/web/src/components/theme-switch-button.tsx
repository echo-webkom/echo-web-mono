"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  function toggleTheme() {
    setTheme(isDarkMode ? "light" : "dark");
  }

  return (
    <button onClick={toggleTheme} className="h-8 w-8">
      <Moon className="block h-full w-full p-1 dark:hidden" />
      <Sun className="hidden h-full w-full p-1 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
