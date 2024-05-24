"use client";

import React, { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { reactToAction } from "@/actions/reactions";
import { idToEmoji } from "@/lib/emojis";
import { cn } from "@/utils/cn";

type Reactions = Array<{
  emojiId: number;
  count: number;
  hasReacted: boolean;
  reactToKey: string;
}>;

type ReactionButtonsProps = {
  reactions: Reactions;
};

export const ReactionButtons = ({ reactions }: ReactionButtonsProps) => {
  const [optimisticReactions, setOptimisticReactions] = useState(reactions);
  const [_, action] = useFormState(reactToAction, undefined);

  const optimisticAction = (formData: FormData) => {
    setOptimisticReactions((previous) => {
      const emojiId = Number(formData.get("emojiId"));
      return previous.map((reaction) => {
        if (reaction.emojiId === emojiId) {
          const hasReacted = !reaction.hasReacted;
          const count = hasReacted ? reaction.count + 1 : reaction.count - 1;
          return {
            ...reaction,
            count,
            hasReacted,
          };
        }

        return reaction;
      });
    });

    action(formData);
  };

  return (
    <div className="flex gap-3">
      {optimisticReactions.map((reaction) => {
        return (
          <form key={reaction.emojiId} action={optimisticAction}>
            <input type="hidden" name="reactToKey" value={reaction.reactToKey} />
            <input type="hidden" name="emojiId" value={reaction.emojiId} />
            <ReactionButton hasReacted={reaction.hasReacted}>
              <div className="flex gap-1 font-normal">
                <p>{idToEmoji[reaction.emojiId]}</p>
                <p>{reaction.count ?? 0}</p>
              </div>
            </ReactionButton>
          </form>
        );
      })}
    </div>
  );
};

type ReactionButtonProps = {
  hasReacted: boolean;
  children: React.ReactNode;
};

const ReactionButton = ({ hasReacted, children }: ReactionButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn("flex h-8 w-14 items-center justify-center rounded-full", {
        "bg-reaction text-foreground hover:bg-reaction": hasReacted,
        "bg-muted text-foreground hover:bg-muted sm:hover:bg-reaction": !hasReacted,
        "cursor-not-allowed opacity-55": pending,
      })}
    >
      <div className="flex gap-1 font-normal">{children}</div>
    </button>
  );
};
