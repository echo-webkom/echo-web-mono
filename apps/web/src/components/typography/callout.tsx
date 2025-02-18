import React from "react";
import {
  RxExclamationTriangle as Exclamation,
  RxQuestionMarkCircled as QuestionMark,
} from "react-icons/rx";

import { cn } from "@/utils/cn";

type CalloutProps = {
  type?: "info" | "warning" | "danger";
  noIcon?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const Callout = ({ type = "info", noIcon = false, className, children }: CalloutProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border-2 p-4",
        {
          "border-info-dark bg-info text-info-foreground": type === "info",
          "border-warning-dark bg-warning text-warning-foreground": type === "warning",
          "border-destructive-dark bg-destructive text-destructive-foreground": type === "danger",
        },
        className,
      )}
      data-testid="callout"
    >
      {!noIcon && (
        <div>
          {type === "info" && <QuestionMark className="h-5 w-5" />}
          {type !== "info" && <Exclamation className="h-5 w-5" />}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
