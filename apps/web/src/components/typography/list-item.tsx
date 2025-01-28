import React from "react";

import { cn } from "@/utils/cn";

type ListItemProps = {
  className?: string;
  children: React.ReactNode;
};

export const ListItem = ({ className, children }: ListItemProps) => {
  return <li className={cn("text-lg", className)}>{children}</li>;
};
