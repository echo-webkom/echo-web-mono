"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuTrash } from "react-icons/lu";

import { deleteCommentAction } from "@/actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
};

export const CommentDeleteButton = ({ id }: CommentDeleteButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submitAction = (formData: FormData) => {
    startTransition(async () => {
      await deleteCommentAction(formData);
    });
    router.refresh();
  };

  return (
    <form action={submitAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center text-sm text-muted-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
      >
        <LuTrash className="mr-1 h-3 w-3" />
        Slett
      </button>
    </form>
  );
};
