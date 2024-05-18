"use client";

import { useState } from "react";
import { LuSend as Send } from "react-icons/lu";

import { addReplyAction } from "@/actions/add-comment";
import { Textarea } from "../ui/textarea";
import { useComment } from "./comment-provider";

export const CommentReplyTextarea = () => {
  const { commentId, postId, isOpen, setIsOpen } = useComment();
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await addReplyAction(postId, content, commentId);
    setContent("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit}>
      <Textarea
        className="h-18 w-full"
        placeholder="Svar på kommentaren..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button className="mt-2 flex items-center text-sm text-muted-foreground hover:underline">
        <Send className="mr-1 h-3 w-3" />
        Svar
      </button>
    </form>
  );
};
