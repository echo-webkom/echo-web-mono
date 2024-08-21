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
        "block w-full border-b-2 border-x-transparent border-b-muted-foreground border-t-transparent bg-transparent py-2 focus:border-x-transparent focus:border-b-gray-300 focus:border-t-transparent focus:ring-0 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      rows={shouldExpand ? 2 : 1}
      value={value}
      {...props}
    />
  );
};
