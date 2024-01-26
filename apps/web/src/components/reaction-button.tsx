"use client";

import React, { useState } from "react";

import { type Reaction } from "@echo-webkom/db/schemas";

import { Button } from "./ui/button";

type ReactionButtonProps = {
  reactions: Array<Reaction>;
  // happeningId: string;
  handleReaction: (emoji: number) => Promise<void>;
};

// eslint-disable-next-line @next/next/no-async-client-component
export default function ReactionButtons({ reactions, handleReaction }: ReactionButtonProps) {
  console.log(reactions);
  return (
    <div className="flex gap-2">
      <ReactionButton emoji="👍" handleReaction={handleReaction} />
      {/* <ReactionButton emoji="👎" />
      <ReactionButton emoji="👏" />
      <ReactionButton emoji="🤔" /> */}
    </div>
  );
}

function ReactionButton({
  emoji,
  handleReaction,
}: {
  emoji: string;
  handleReaction: (emoji: number) => Promise<void>;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setCount(isClicked ? count - 1 : count + 1);
    handleReaction(0).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Button
      onClick={handleClick}
      className={`${isClicked ? "bg-wave hover:bg-wave" : "bg-muted hover:bg-muted"} h-8 w-14 rounded-full text-foreground`}
    >
      <div className="flex gap-1 font-normal">
        <p>{emoji}</p>
        <p>{count}</p>
      </div>
    </Button>
  );
}
