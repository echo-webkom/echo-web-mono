"use client";

import React from "react";

import { cn } from "@/utils/cn";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<"select">>(
  ({ children, value, className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "border-border bg-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border-2 px-3 py-2 text-sm font-semibold focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        value ? "text-foreground" : "text-muted-foreground",
        className,
      )}
      defaultValue={value}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
