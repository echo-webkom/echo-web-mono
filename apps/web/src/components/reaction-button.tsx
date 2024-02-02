"use client";

import { useOptimistic } from "react";

import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

type ReactionButtonProps = {
  value: string;
  hasReacted: boolean;
  count: number;
};

export default function ReactionButton({ value, hasReacted, count }: ReactionButtonProps) {
  const [optimisticCount, addOptimisticCount] = useOptimistic(count, (currentCount, newCount) => {
    return currentCount + 2;
  });

  return (
    <Button
      type="submit"
      className={cn(
        "h-8 w-14 rounded-full",
        hasReacted
          ? "bg-reaction hover:bg-reaction text-foreground"
          : "hover:bg-reaction bg-muted text-foreground",
      )}
    >
      <div className="flex gap-1 font-normal">
        <p>{value}</p>
        <p>{optimisticCount ?? 0}</p>
      </div>
    </Button>
  );
}
