"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  function changeTheme() {
    setTheme(isDarkMode ? "light" : "dark");
  }
  return (
    <button onClick={() => changeTheme()}>
      {isDarkMode ? (
        <Sun className="text-foreground h-8 d-8"/>
      ) : (
        <Moon className="text-foreground h-8 d-8" />
      )}

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
