"use client";

import React from "react";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generate-id";

export type HeadingProps = {
  level?: 1 | 2 | 3;
  copyable?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, copyable = false, className, children }, ref) => {
    const Comp = `h${level}` as const;
    const id = generateId(children);

    return (
      <Comp
        id={id}
        ref={ref}
        className={cn(
          "group flex items-center font-semibold tracking-tight",
          {
            "text-4xl": level === 1,
            "text-2xl": level === 2,
            "text-xl": level === 3,
          },
          className,
        )}
      >
        {children}

        {copyable && (
          <button
            tabIndex={-1}
            className="ml-2 text-muted-foreground opacity-0 transition-opacity hover:underline group-hover:block group-hover:opacity-100"
            onClick={() => {
              void navigator.clipboard.writeText(
                window.location.origin + window.location.pathname + "#" + id,
              );
            }}
          >
            #
          </button>
        )}
      </Comp>
    );
  },
);
Heading.displayName = "Heading";
