"use client";

import { useOptimistic, useState } from "react";

import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

type ReactionButtonProps = {
  value: string;
  hasReacted: boolean;
  count: number;
};

export default function ReactionButton({ value, hasReacted, count }: ReactionButtonProps) {
  const [isClicked, setIsClicked] = useState(hasReacted ? true : false);

  const setBacgroundColor = (state: boolean) => {
    return state
      ? "bg-reaction hover:bg-reaction text-foreground"
      : "sm:hover:bg-reaction hover:bg-muted bg-muted text-foreground";
  };

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
    isClicked ? addOptimisticCount(1) : addOptimisticCount(-1);
  };

  const [optimisticCount, addOptimisticCount] = useOptimistic(count, (currentCount) => {
    return isClicked ? currentCount + 1 : currentCount - 1;
  });

  return (
    <div onClick={handleButtonClick}>
      <Button type="submit" className={cn("h-8 w-14 rounded-full", setBacgroundColor(isClicked))}>
        <div className="flex gap-1 font-normal">
          <p>{value}</p>
          <p>{optimisticCount ?? 0}</p>
        </div>
      </Button>
    </div>
  );
}
