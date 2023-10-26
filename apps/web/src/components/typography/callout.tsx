import React from "react";
import { ExclamationTriangleIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils/cn";

type CalloutProps = {
  type?: "info" | "warning" | "danger";
  noIcon?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ type = "info", noIcon = false, className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 border-l-4 p-4",
          {
            "border-blue-500 bg-blue-400/80 text-blue-700": type === "info",
            "border-yellow-500 bg-wave text-yellow-700": type === "warning",
            "border-red-500 bg-red-400/80 text-red-700": type === "danger",
          },
          className,
        )}
      >
        {!noIcon && (
          <div>
            {type === "info" && <QuestionMarkCircledIcon className="h-5 w-5" />}
            {type !== "info" && <ExclamationTriangleIcon className="h-5 w-5" />}
          </div>
        )}
        <div>{children}</div>
      </div>
    );
  },
);
Callout.displayName = "Callout";
