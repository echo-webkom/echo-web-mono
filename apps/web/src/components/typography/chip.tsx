import React from "react";

import { cn } from "@/utils/cn";

type ChipProps = {
  className?: string;
  children: React.ReactNode;
};

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(({ className, children }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700",
        className,
      )}
    >
      {children}
    </span>
  );
});
Chip.displayName = "Chip";
