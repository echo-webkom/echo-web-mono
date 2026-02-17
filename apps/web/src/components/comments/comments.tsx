import { auth } from "@/auth/session";
import { buildCommentTreeFrom } from "@/lib/comment-tree";
import { unoWithAdmin } from "../../api/server";
import { ReplyTree } from "./comment-reply-tree";

type CommentsProps = {
  id: string;
};

export const Comments = async ({ id }: CommentsProps) => {
  const [user, comments] = await Promise.all([auth(), unoWithAdmin.comments.all(id)]);

  if (!comments.length) {
    return (
      <p className="text-muted-foreground">
        Ingen kommentarer enda. Bli den første til å kommentere!
      </p>
    );
  }

  const commentTree = buildCommentTreeFrom(comments, null);

  const u = user
    ? {
        id: user.id,
        name: user.name,
        image: user.image,
      }
    : null;

  return <ReplyTree comments={commentTree} user={u} />;
};
