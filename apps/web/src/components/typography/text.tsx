import React from "react";

import { cn } from "@/utils/cn";

type TextProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

export const Text = ({ size = "md", className, children }: TextProps) => {
  return (
    <p
      className={cn(
        "break-words py-1 leading-relaxed",
        {
          "text-sm": size === "sm",
          "text-lg": size === "md",
          "text-xl": size === "lg",
        },
        className,
      )}
    >
      {children}
    </p>
  );
};
