import { type User } from "@echo-webkom/db/schemas";

import { getCommentsById } from "@/data/comments/queries";
import { buildCommentTreeFrom, type CommentTree } from "@/lib/comment-tree";
import { getUser } from "@/lib/get-user";
import { shortDate } from "@/utils/date";
import { initials } from "@/utils/string";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentProvider } from "./comment-provider";
import { CommentReplyButton } from "./comment-reply-button";
import { CommentReplyTextarea } from "./comment-reply-textarea";

type CommentsProps = {
  id: string;
};

export const Comments = async ({ id }: CommentsProps) => {
  const [user, comments] = await Promise.all([getUser(), getCommentsById(id)]);

  if (!comments.length) {
    return (
      <p className="text-muted-foreground">
        Ingen kommentarer enda. Bli den første til å kommentere!
      </p>
    );
  }

  const commentTree = buildCommentTreeFrom(comments, null);

  return <ReplyTree comments={commentTree} user={user} />;
};

type ReplyTreeProps = {
  comments: CommentTree;
  user: User | null;
  depth?: number;
};

const ReplyTree = ({ comments, user, depth = 0 }: ReplyTreeProps) => {
  if (!comments.length) {
    return null;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li className="flex gap-4 py-4" key={comment.id}>
          <CommentProvider
            commentId={comment.id}
            postId={comment.postId}
            userId={comment.user?.id ?? null}
            isOpen={false}
          >
            <Avatar className="h-14 w-14">
              <AvatarImage src={undefined} />
              <AvatarFallback>{initials(comment.user?.name ?? "ON")}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <h3 className="text-lg font-medium">{comment.user?.name ?? "[slettet]"}</h3>
                <p className="text-sm text-muted-foreground">{shortDate(comment.createdAt)}</p>
              </div>

              <p className="mb-1">{comment.content}</p>

              <div className="flex gap-4">
                <CommentReplyButton />
                {comment.user && user?.id === comment.user.id && (
                  <CommentDeleteButton id={comment.id} />
                )}
              </div>

              <CommentReplyTextarea />

              <ReplyTree comments={comment.children} user={user} depth={depth + 1} />
            </div>
          </CommentProvider>
        </li>
      ))}
    </ul>
  );
};
