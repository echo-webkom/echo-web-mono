"use client";

import React, { useOptimistic } from "react";

import { reactAction } from "@/actions/reactions";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

type Reaction = {
  count: number;
  hasReacted: boolean;
};

type ReactionButtonProps = {
  reactToKey: string;
  hasReacted: boolean;
  count: number;
  emojiId: number;
  children: React.ReactNode;
};

export const ReactionButton = ({
  reactToKey,
  hasReacted,
  count,
  emojiId,
  children,
}: ReactionButtonProps) => {
  const [reactionState, setOptimisticReaction] = useOptimistic<Reaction, Reaction>(
    {
      count,
      hasReacted,
    },
    (_, optimisticValue) => {
      return optimisticValue;
    },
  );

  const formAction = async () => {
    setOptimisticReaction({
      hasReacted: !reactionState.hasReacted,
      count: !reactionState.hasReacted ? reactionState.count + 1 : reactionState.count - 1,
    });
    await reactAction({
      reactToKey,
      emojiId,
    });
  };

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="ghost"
        className={cn("h-8 w-14 rounded-full", {
          "bg-reaction text-foreground hover:bg-reaction": reactionState.hasReacted,
          "bg-muted text-foreground hover:bg-muted sm:hover:bg-reaction": !reactionState.hasReacted,
        })}
      >
        <div className="flex gap-1 font-normal">
          <p>{children}</p>
          <p>{reactionState.count ?? 0}</p>
        </div>
      </Button>
    </form>
  );
};
