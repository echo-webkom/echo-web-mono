import { useRouter } from "next/navigation";
import { LuArrowBigUp } from "react-icons/lu";

import { likeComment } from "@/actions/like-comment";
import { cn } from "@/utils/cn";
import { useComment } from "./comment-provider";

type CommentLikeButtonProps = {
  currentUserId: string | null;
};

export const CommentLikeButton = ({ currentUserId }: CommentLikeButtonProps) => {
  const { commentId, userId, reactions } = useComment();
  const router = useRouter();

  const isLiked = reactions.some((reaction) => reaction.userId === currentUserId);
  const likes = reactions.filter((reaction) => reaction.type === "like").length;

  const toggleLiked = async () => {
    await likeComment(commentId);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggleLiked}
      className="flex items-center gap-1 text-sm text-muted-foreground disabled:cursor-not-allowed"
      disabled={!userId}
    >
      <LuArrowBigUp
        className={cn("h-4 w-4", {
          "fill-muted-dark dark:fill-slate-300": isLiked,
        })}
      />
      <span>{likes}</span>
    </button>
  );
};
