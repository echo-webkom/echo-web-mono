"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  function changeTheme() {
    setTheme(isDarkMode ? "light" : "dark");
  }

  return (
    <button onClick={() => changeTheme()} suppressHydrationWarning>
      {isDarkMode ? (
        <Sun className="d-8 h-8 text-foreground" />
      ) : (
        <Moon className="d-8 h-8 text-foreground" />
      )}

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
