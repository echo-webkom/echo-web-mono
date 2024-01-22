"use client";

import React, { useState } from "react";

import { Button } from "./ui/button";

export default function ReactionButtons() {
  return (
    <div className="flex gap-2">
      <ReactionButton emoji="👍" />
      <ReactionButton emoji="👎" />
      <ReactionButton emoji="👏" />
      <ReactionButton emoji="🤔" />
    </div>
  );
}

function ReactionButton({ emoji }: { emoji: string }) {
  const [isClicked, setIsClicked] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setCount(isClicked ? count - 1 : count + 1);
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
