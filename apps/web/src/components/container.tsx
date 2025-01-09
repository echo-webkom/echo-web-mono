import React, { type HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  layout?: "normal" | "larger" | "full";
  children: React.ReactNode;
};

export const Container = ({ layout = "normal", className, children, ...props }: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8",
        {
          "max-w-[1200px]": layout === "normal",
          "max-w-[1500px]": layout === "larger",
          "max-w-full": layout === "full",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
