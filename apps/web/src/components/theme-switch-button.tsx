"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setTheme(isDarkMode ? "light" : "dark");
    }, 200);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`h-8 w-8 transition ${isTransitioning ? "opacity-20" : "opacity-100"}`}
      style={{ transition: "opacity 0.5s ease" }}
    >
      <LuMoon
        className={`block h-full w-full p-1 ${isDarkMode ? "dark:hidden" : "dark:block"}`}
        style={{ opacity: isTransitioning ? 0 : 1 }}
      />
      <LuSun
        className={`hidden h-full w-full p-1 ${isDarkMode ? "dark:block" : "dark:hidden"}`}
        style={{ opacity: isTransitioning ? 0 : 1 }}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

