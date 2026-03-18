"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { toast } from "sonner";

import type { QuoteReaction } from "@/api/uno/client";
import { Button } from "@/components/ui/button";
import { useUnoClient } from "@/providers/uno";
import { cn } from "@/utils/cn";

type QuoteReactionsProps = {
  quoteId: string;
  reactions: Array<QuoteReaction>;
  userId: string | null;
};

function countReactions(reactions: Array<QuoteReaction>, type: "like" | "dislike") {
  return reactions.filter((r) => r.reaction_type === type).length;
}

function hasReacted(reactions: Array<QuoteReaction>, userId: string, type: "like" | "dislike") {
  return reactions.some((r) => r.user_id === userId && r.reaction_type === type);
}

function toggleReaction(
  reactions: Array<QuoteReaction>,
  userId: string,
  type: "like" | "dislike",
): Array<QuoteReaction> {
  const existing = reactions.find((r) => r.user_id === userId);

  if (existing) {
    // Remove existing reaction
    const without = reactions.filter((r) => r.user_id !== userId);
    // If it was a different type, add the new one
    if (existing.reaction_type !== type) {
      return [...without, { user_id: userId, reaction_type: type }];
    }
    return without;
  }

  return [...reactions, { user_id: userId, reaction_type: type }];
}

export function QuoteReactions({ quoteId, reactions, userId }: QuoteReactionsProps) {
  const unoClient = useUnoClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticReactions, setOptimisticReactions] = useOptimistic(reactions);

  const handleReaction = (type: "like" | "dislike") => {
    if (!userId) return;

    startTransition(async () => {
      setOptimisticReactions(toggleReaction(optimisticReactions, userId, type));

      const ok =
        type === "like"
          ? await unoClient.quotes.toggleLike(quoteId)
          : await unoClient.quotes.toggleDislike(quoteId);

      if (ok) {
        router.refresh();
      } else {
        toast.error("Kunne ikke reagere på sitat");
      }
    });
  };

  const likeCount = countReactions(optimisticReactions, "like");
  const dislikeCount = countReactions(optimisticReactions, "dislike");
  const liked = userId ? hasReacted(optimisticReactions, userId, "like") : false;
  const disliked = userId ? hasReacted(optimisticReactions, userId, "dislike") : false;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleReaction("like")}
        disabled={!userId || isPending}
        className={cn(liked && "text-green-600 dark:text-green-400")}
      >
        <LuThumbsUp className="h-4 w-4" />
      </Button>
      {likeCount > 0 && <span className="text-muted-foreground text-xs">{likeCount}</span>}

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => handleReaction("dislike")}
        disabled={!userId || isPending}
        className={cn(disliked && "text-red-600 dark:text-red-400")}
      >
        <LuThumbsDown className="h-4 w-4" />
      </Button>
      {dislikeCount > 0 && <span className="text-muted-foreground text-xs">{dislikeCount}</span>}
    </div>
  );
}
