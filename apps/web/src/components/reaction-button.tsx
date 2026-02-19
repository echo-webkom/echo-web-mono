"use client";

import React, { useState } from "react";

import { handleReact } from "@/actions/reactions";
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
  userId: string | undefined;
  children: React.ReactNode;
};

export const ReactionButton = ({
  reactToKey,
  hasReacted,
  count,
  emojiId,
  userId,
  children,
}: ReactionButtonProps) => {
  const [state, setState] = useState<Reaction>({ count, hasReacted });
  const [isPending, setIsPending] = useState(false);

  const formAction = async () => {
    if (isPending) return;
    setIsPending(true);
    const toggled = !state.hasReacted;
    setState((s) => ({
      hasReacted: toggled,
      count: toggled ? s.count + 1 : s.count - 1,
    }));
    const result = await handleReact(reactToKey, emojiId);
    if (Array.isArray(result)) {
      const forThisEmoji = result.filter((r) => r.emojiId === emojiId);
      setState({
        count: forThisEmoji.length,
        hasReacted: forThisEmoji.some((r) => r.userId === userId),
      });
    }
    setIsPending(false);
  };

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="ghost"
        disabled={isPending}
        className={cn("h-8 w-14 rounded-full", {
          "bg-reaction text-foreground hover:bg-reaction": state.hasReacted,
          "bg-muted text-foreground hover:bg-muted sm:hover:bg-reaction": !state.hasReacted,
        })}
      >
        <div className="flex gap-1 font-normal">
          <p>{children}</p>
          <p>{state.count}</p>
        </div>
      </Button>
    </form>
  );
};
