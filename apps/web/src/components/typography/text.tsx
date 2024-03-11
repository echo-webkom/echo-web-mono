import React from "react";

import { cn } from "@/utils/cn";

type TextProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = "md", className, children }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "break-words py-2 leading-relaxed",
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
  },
);
Text.displayName = "Text";
