import React from "react";

import { cn } from "@/utils/cn";

export type HeadingProps = {
  level?: 1 | 2 | 3;
  className?: string;
  children: React.ReactNode;
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, className, children }, ref) => {
    const Comp = `h${level}` as const;

    return (
      <Comp
        ref={ref}
        className={cn(
          "font-semibold tracking-tight",
          {
            "text-4xl": level === 1,
            "text-3xl": level === 2,
            "text-2xl": level === 3,
          },
          className,
        )}
      >
        {children}
      </Comp>
    );
  },
);
Heading.displayName = "Heading";
