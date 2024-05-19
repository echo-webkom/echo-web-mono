import { getUser } from "@/lib/get-user";
import { cn } from "@/utils/cn";
import { Heading } from "../typography/heading";
import { CommentForm } from "./comment-form";
import { Comments } from "./comments";

type CommentSectionProps = {
  id: string;
  className?: string;
};

export const CommentSection = async ({ id, className }: CommentSectionProps) => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Heading className="font-medium" level={2}>
        Kommentarer
      </Heading>
      <CommentForm id={id} />
      <Comments id={id} />
    </div>
  );
};
