"use client";

import { useTheme } from "next-themes";

import { Particles } from "@/components/ui/particles";

export const ParticlesBackdrop = () => {
  const { theme } = useTheme();

  const color = theme === "dark" ? "#ffffff" : "#333333";

  return (
    <Particles
      className="pointer-events-none absolute inset-0"
      quantity={100}
      ease={80}
      color={color}
      refresh
    />
  );
};
