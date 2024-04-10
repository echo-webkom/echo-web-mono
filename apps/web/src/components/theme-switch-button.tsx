"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDarkMode = theme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function toggleTheme() {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1000);
    setTheme(isDarkMode ? "light" : "dark");
  }

  const Icon = isDarkMode ? LuSun : LuMoon;

  if (!isMounted) return null;

  return (
    <button onClick={toggleTheme} className={`h-8 w-8 ${isRotating ? "animate-around" : ""}`}>
      <Icon className="block h-full w-full p-1" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
