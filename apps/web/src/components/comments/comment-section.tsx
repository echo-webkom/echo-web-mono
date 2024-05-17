import { getUser } from "@/lib/get-user";
import { Heading } from "../typography/heading";
import { CommentForm } from "./comment-form";
import { Comments } from "./comments";

type CommentSectionProps = {
  id: string;
};

export const CommentSection = async ({ id }: CommentSectionProps) => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Heading level={2}>Kommentarer</Heading>
      <CommentForm id={id} />
      <Comments id={id} />
    </div>
  );
};
