"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

import { cn } from "@/utils/cn";

export const ThemeSwitchButton = () => {
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
      className={cn("h-8 w-8 cursor-pointer transition", {
        "opacity-20": isTransitioning,
      })}
      style={{ transition: "opacity 0.5s ease" }}
    >
      <LuMoon
        className="block h-full w-full p-1 dark:hidden"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      />
      <LuSun
        className="hidden h-full w-full p-1 dark:block"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
