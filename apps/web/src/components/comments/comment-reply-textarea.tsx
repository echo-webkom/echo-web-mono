"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuSend as Send } from "react-icons/lu";

import { addReplyAction } from "@/actions/add-comment";
import { useComment } from "./comment-provider";
import { CommentTextarea } from "./comment-textarea";

export const CommentReplyTextarea = () => {
  const router = useRouter();
  const { commentId, postId, isOpen, setIsOpen } = useComment();
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await addReplyAction(postId, content, commentId);
    setContent("");
    setIsOpen(false);
    router.refresh();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <CommentTextarea
        className="max-w-[300px]"
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
