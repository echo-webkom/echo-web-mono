"use client";

import { LuTrash } from "react-icons/lu";

import { deleteCommentAction } from "@/actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
};

export const CommentDeleteButton = ({ id }: CommentDeleteButtonProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form action={deleteCommentAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center text-sm text-muted-foreground hover:underline"
      >
        <LuTrash className="mr-1 h-3 w-3" />
        Slett
      </button>
    </form>
  );
};
