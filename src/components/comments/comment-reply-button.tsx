"use client";

import { useEffect } from "react";
import { LuReply as Reply, LuX as X } from "react-icons/lu";

import { useComment } from "./comment-provider";

export const CommentReplyButton = () => {
  const { isOpen, setIsOpen } = useComment();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  });

  return (
    <button
      onClick={handleClick}
      className="flex flex-row items-center text-sm text-muted-foreground hover:underline"
    >
      {isOpen ? <X className="mr-1 h-3 w-3" /> : <Reply className="mr-1 h-3 w-3" />}
      {isOpen ? "Avbryt" : "Svar"}
    </button>
  );
};
