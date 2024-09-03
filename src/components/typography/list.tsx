import React from "react";

import { cn } from "@/utils/cn";

type ListProps = {
  className?: string;
  children: React.ReactNode;
};

export const OrderedList = React.forwardRef<HTMLOListElement, ListProps>(
  ({ className, children }, ref) => {
    return (
      <ol ref={ref} className={cn("list-decimal space-y-1 pl-8 leading-relaxed", className)}>
        {children}
      </ol>
    );
  },
);
OrderedList.displayName = "OrderedList";

export const UnorderedList = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, children }, ref) => {
    return (
      <ul ref={ref} className={cn("list-disc space-y-1 pl-8 leading-relaxed", className)}>
        {children}
      </ul>
    );
  },
);
UnorderedList.displayName = "UnorderedList";
