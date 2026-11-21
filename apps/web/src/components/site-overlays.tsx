"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { type ReactNode } from "react";

export const SiteOverlays = ({ children }: { children: ReactNode }) => {
  const segments = useSelectedLayoutSegments();

  if (segments.includes("(print)")) {
    return null;
  }

  return children;
};
