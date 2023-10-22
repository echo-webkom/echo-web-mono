import React from "react";

import { cn } from "@/utils/cn";

type ListItemProps = {
  className?: string;
  children: React.ReactNode;
};

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, children }, ref) => {
    return (
      <li ref={ref} className={cn("text-lg", className)}>
        {children}
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
