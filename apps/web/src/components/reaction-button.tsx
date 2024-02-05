"use client";

import React, { useOptimistic } from "react";

import { handleReact } from "@/actions/reactions";
import { cn } from "@/utils/cn";
import { Button } from "./ui/button";

type ReactionButtonProps = {
  reactToKey: string;
  hasReacted: boolean;
  count: number;
  emojiId: number;
  children: React.ReactNode;
};

export default function ReactionButton({
  reactToKey,
  hasReacted,
  count,
  emojiId,
  children,
}: ReactionButtonProps) {
  const [reactionState, setOptimisticReaction] = useOptimistic(
    {
      count,
      hasReacted,
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (currentState, optimisticValue) => {
      return optimisticValue;
    },
  );

  const formAction = async () => {
    setOptimisticReaction({
      hasReacted: !reactionState.hasReacted,
      count: !reactionState.hasReacted ? reactionState.count + 1 : reactionState.count - 1,
    });
    await handleReact(reactToKey, emojiId);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form action={formAction}>
      <Button
        type="submit"
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
}
