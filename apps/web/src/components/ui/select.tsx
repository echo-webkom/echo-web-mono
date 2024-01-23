"use client";

import React from "react";
import clsx from "clsx";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<"select">>(
  ({ children, value, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(
        "flex h-10 w-full items-center justify-between rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        value ? "text-foreground" : "text-muted-foreground",
      )}
      defaultValue={value}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
