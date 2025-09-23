"use client";

import React from "react";

import { cn } from "@/utils/cn";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<"select">>(
  ({ children, value, className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border-2 border-border bg-input px-3 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
