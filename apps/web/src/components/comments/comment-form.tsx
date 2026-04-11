"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { addCommentAction } from "@/actions/add-comment";

import { CommentTextarea } from "./comment-textarea";

type CommentFormProps = {
  id: string;
};

export const CommentForm = ({ id }: CommentFormProps) => {
  const router = useRouter();
  const [content, setContent] = useState("");

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content) {
      return;
    }

    const result = await addCommentAction(id, content);

    if (!result) {
      toast.warning("Noe gikk galt", {
        description: "Kunne ikke legge til kommentar",
      });

      return;
    }

    setContent("");
    router.refresh();
    toast.success("Kommentar lagt til");
  };

  return (
    <form onSubmit={handleSumbit} className="flex w-full max-w-125 flex-col gap-4">
      <CommentTextarea
        id="content"
        name="content"
        placeholder="Skriv din kommentar her..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="group text-muted-foreground flex w-fit items-center px-2 font-medium hover:underline"
      >
        Legg til kommentar
        <ArrowRight className="ml-1 inline-block size-4 transform opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
      </button>
    </form>
  );
};
