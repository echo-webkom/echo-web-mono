"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { cn } from "@/utils/cn";

const THEME_CYCLE = ["light", "dark", "system"] as const;
type Theme = (typeof THEME_CYCLE)[number];

const THEME_LABELS: Record<Theme, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System preference",
};

export const ThemeSwitchButton = () => {
  const { theme, setTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mounted = useIsMounted();

  const currentTheme = (theme as Theme) ?? "system";

  const nextTheme = THEME_CYCLE[(THEME_CYCLE.indexOf(currentTheme) + 1) % THEME_CYCLE.length]!;

  const cycleTheme = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setTheme(nextTheme);
    }, 200);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 250);
  };

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn("h-8 w-8 transition")}
      style={{ transition: "opacity 0.5s ease", opacity: isTransitioning ? 0.2 : 1 }}
      aria-label={THEME_LABELS[currentTheme]}
    >
      {currentTheme === "light" && <Sun className="h-full w-full p-1" />}
      {currentTheme === "dark" && <Moon className="h-full w-full p-1" />}
      {currentTheme === "system" && <Laptop className="h-full w-full p-1" />}
      <span className="sr-only">{THEME_LABELS[currentTheme]}</span>
    </button>
  );
};
