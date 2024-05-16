"use client";

import { useState } from "react";

import { addCommentAction } from "@/actions/add-comment";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

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
    <form onSubmit={handleSumbit} className="flex flex-col gap-4">
      <Textarea
        id="content"
        name="content"
        placeholder="Skriv din kommentar her..."
        className="h-16 w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button type="submit" className="w-fit">
        Send
      </Button>
    </form>
  );
};
