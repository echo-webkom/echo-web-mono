"use client";

import React from "react";
import clsx from "clsx";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<"select">>(
  ({ children, value, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(
        "flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50",
        value ? "text-slate-900" : "text-slate-400",
      )}
      defaultValue={value}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
