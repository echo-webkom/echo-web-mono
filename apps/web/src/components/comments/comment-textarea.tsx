import { type TextareaHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type CommentTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const CommentTextarea = ({ className, value, ...props }: CommentTextareaProps) => {
  if (typeof value !== "string") {
    throw new Error("CommentTextarea must have a value prop of type string");
  }

  const shouldExpand = value.split("\n").length > 1;

  return (
    <textarea
      className={cn(
        "w-full resize-none border-0 border-b-2 border-slate-200 bg-transparent outline-0 transition-all focus:border-0 focus:border-b-2 focus:border-b-muted-foreground focus:ring-0",
        {
          "border-b-slate-300": !value,
        },
        className,
      )}
      rows={shouldExpand ? 2 : 1}
      value={value}
      {...props}
    />
  );
};
