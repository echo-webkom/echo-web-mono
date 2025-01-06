import React from "react";

import { cn } from "@/utils/cn";

type ListProps = {
  className?: string;
  children: React.ReactNode;
};

export const OrderedList = ({ className, children }: ListProps) => {
  return (
    <ol className={cn("list-decimal space-y-1 pl-8 leading-relaxed", className)}>{children}</ol>
  );
};

export const UnorderedList = ({ className, children }: ListProps) => {
  return <ul className={cn("list-disc space-y-1 pl-8 leading-relaxed", className)}>{children}</ul>;
};
