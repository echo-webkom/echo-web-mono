"use client";

import { useState } from "react";
import { LuArrowRight as ArrowRight } from "react-icons/lu";

import { addCommentAction } from "@/actions/add-comment";
import { useToast } from "@/hooks/use-toast";
import { CommentTextarea } from "./comment-textarea";

type CommentFormProps = {
  id: string;
};

export const CommentForm = ({ id }: CommentFormProps) => {
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content) {
      return;
    }

    const result = await addCommentAction(id, content);

    if (!result) {
      toast({
        title: "Noe gikk galt",
        description: "Kunne ikke legge til kommentar",
        variant: "warning",
      });

      return;
    }

    setContent("");
    toast({
      title: "Kommentar lagt til",
      variant: "success",
    });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSumbit} className="flex w-full max-w-[500px] flex-col gap-4">
      <CommentTextarea
        id="content"
        name="content"
        placeholder="Skriv din kommentar her..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="group flex w-fit items-center px-2 font-medium text-muted-foreground hover:underline"
      >
        Legg til kommentar
        <ArrowRight className="ml-1 inline-block transform opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
      </button>
    </form>
  );
};
