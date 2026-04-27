import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/utils/cn";

const chipVariants = cva("inline-block rounded-full border px-3 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      primary: "border-primary-dark bg-primary text-primary-foreground",
      secondary: "border-secondary-dark bg-secondary text-secondary-foreground",
      destructive: "border-destructive-dark bg-destructive text-destructive-foreground",
      stealth: "bg-gray-200 text-gray-700",
      outlined: "bg-none text-primary-foreground border border-secondary",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ChipProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>;

export const Chip = ({ variant, className, children }: ChipProps) => {
  return <span className={cn(chipVariants({ variant, className }))}>{children}</span>;
};
